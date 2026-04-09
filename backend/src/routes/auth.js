const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendRegistrationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const generateRegNumber = (role) => {
    const prefix = role.substring(0, 2).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
};

module.exports = { generateRegNumber };

// @route   POST api/auth/register
// @desc    Register a participant
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, paymentIntentId, paymentStatus } = req.body;

        console.log(`📝 Tentative d'inscription pour: ${email} (Rôle: ${role})`);

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log(`Email déjà utilisé: ${email}`);
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        }

        // Clean up data before creating user
        const userData = { ...req.body };
        delete userData.confirmPassword;

        let verifiedPaymentStatus = paymentStatus || 'pending';

        // Verify Stripe Payment Intent securely if provided
        if (paymentIntentId) {
            try {
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    verifiedPaymentStatus = 'paid';
                } else {
                    console.log(`Intention de paiement Stripe non validée: ${paymentIntentId}`);
                    verifiedPaymentStatus = 'pending';
                }
            } catch (stripeErr) {
                console.error(`Erreur vérification Stripe pour ${paymentIntentId}:`, stripeErr.message);
                verifiedPaymentStatus = 'pending';
            }
        }

        userData.paymentStatus = verifiedPaymentStatus;

        user = new User(userData);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Attempt up to 3 times if there is a collision on registrationNumber
        let saved = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!saved && attempts < maxAttempts) {
            try {
                // Generate Registration Number and Secure QR Code Token
                user.registrationNumber = generateRegNumber(role);
                user.qrCode = jwt.sign(
                    { id: user._id, regNum: user.registrationNumber, role: user.role },
                    process.env.JWT_SECRET
                );

                // Generate Registration Numbers and Tokens for additional participants
                if (user.additionalParticipants && user.additionalParticipants.length > 0) {
                    user.additionalParticipants.forEach(p => {
                        p.registrationNumber = generateRegNumber(p.role || 'assistante');
                        p.qrCode = jwt.sign(
                            { id: user._id, type: 'additional', regNum: p.registrationNumber, role: p.role || 'assistante' },
                            process.env.JWT_SECRET
                        );
                    });
                }

                await user.save();
                saved = true;
                console.log(` Utilisateur enregistré avec succès: ${user.registrationNumber}`);
            } catch (saveErr) {
                attempts++;
                if (saveErr.code === 11000 && saveErr.keyPattern && saveErr.keyPattern.registrationNumber && attempts < maxAttempts) {
                    console.warn(`Collision de registrationNumber (${user.registrationNumber}). Tentative ${attempts}/${maxAttempts}...`);
                    // The loop continues and generates a new one
                } else {
                    // Rethrow to the outer catch if it's not a collision or max attempts reached
                    throw saveErr;
                }
            }
        }

        // Send Confirmation Email (Async/Don't block response)
        sendRegistrationEmail(user).catch(err => console.error('Email error:', err));

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    token,
                    user: {
                        id: user.id,
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email,
                        role: user.role,
                        registrationNumber: user.registrationNumber,
                        qrCode: user.qrCode, // Also pass the secure code to the frontend!
                        paymentStatus: user.paymentStatus
                    }
                });
            }
        );
    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);


        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            const message = field === 'registrationNumber'
                ? "Une erreur technique est survenue (numéro d'inscription dupliqué). Veuillez réessayer."
                : `Ce ${field} est déjà utilisé.`;
            return res.status(400).json({ message });
        }

        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription', error: err.message });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email,
                        role: user.role,
                        registrationNumber: user.registrationNumber,
                        qrCode: user.qrCode, // Ensure qrCode is returned on login!
                        paymentStatus: user.paymentStatus,
                        nbParticipants: user.nbParticipants,
                        additionalParticipants: user.additionalParticipants
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/me
// @desc    Get current user data
// @access  Private
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// @route   POST api/auth/forgot-password
// @desc    Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Aucun compte associé à cet email' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const emailSent = await sendPasswordResetEmail(user, resetToken);

        if (emailSent) {
            res.json({ message: 'Email de réinitialisation envoyé' });
        } else {
            res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/reset-password/:token
// @desc    Reset password using token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Le lien est invalide ou a expiré' });
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/resend-confirmation
// @desc    Resend confirmation email
router.post('/resend-confirmation', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const { isEmailConfigured } = require('../utils/emailService');
        if (!isEmailConfigured()) {
            return res.status(400).json({ message: "Le service d'email n'est pas configuré. Veuillez contacter l'administrateur." });
        }

        const emailSent = await sendRegistrationEmail(user);

        if (emailSent) {
            res.json({ message: 'Email envoyé avec succès' });
        } else {
            res.status(500).json({ message: "Erreur lors de l'envoi de l'email. Veuillez vérifier l'adresse email et le mot de passe d'application dans le fichier .env." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.generateRegNumber = generateRegNumber;
module.exports = router;
