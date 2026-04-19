const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { generateRegNumber } = require('./auth');
const { sendRegistrationEmail } = require('../utils/emailService');

router.use(auth);
router.use(admin);

// @route   GET api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const paidUsers = await User.countDocuments({ paymentStatus: 'paid', role: { $ne: 'admin' } });

        const revenue = await User.aggregate([
            { $match: { paymentStatus: 'paid', role: { $ne: 'admin' } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const roleStats = await User.aggregate([
            { $match: { role: { $ne: 'admin' } } },
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            paidUsers,
            totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
            roleStats
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/users
// @desc    Create a new user manually
router.post('/users', async (req, res) => {
    try {
        const { role, email } = req.body;


        const defaultPassword = crypto.randomBytes(8).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        const user = new User({
            ...req.body,
            password: hashedPassword
        });

        // Attempt up to 3 times if there is a collision on registrationNumber
        let saved = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!saved && attempts < maxAttempts) {
            try {
                user.registrationNumber = generateRegNumber(role);
                user.qrCode = jwt.sign(
                    { id: user._id, regNum: user.registrationNumber, role: user.role },
                    process.env.JWT_SECRET
                );

                await user.save();
                saved = true;
            } catch (saveErr) {
                attempts++;
                if (saveErr.code === 11000 && saveErr.keyPattern && saveErr.keyPattern.registrationNumber && attempts < maxAttempts) {
                    console.warn(`Admin: Collision de registrationNumber (${user.registrationNumber}). Tentative ${attempts}/${maxAttempts}...`);
                } else {
                    throw saveErr;
                }
            }
        }

        // Send email to the user with their default password and secure QR code
        await sendRegistrationEmail(user, defaultPassword);

        res.json({
            user,
            defaultPassword, // Return the generated password so the admin can give it to the user
            message: 'Utilisateur créé, un mot de passe a été généré et un email a été envoyé.'
        });
    } catch (err) {
        console.error("ADMIN_CREATE_USER_ERROR:", err);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// @route   GET api/admin/users
// @desc    Get all registered users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id
// @desc    Update a user
router.put('/users/:id', async (req, res) => {
    try {
        // Prevent sensitive fields from being updated directly via this route
        const allowedUpdates = [
            'nom', 'prenom', 'email', 'telephone', 'ville', 'pays',
            'role', 'paymentStatus', 'modePaiement', 'totalPrice',
            'nbParticipants', 'additionalParticipants', 'dureeParticipation',
            'ticketsRepas', 'typeStand', 'produitsExposes'
        ];

        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Certains champs ne peuvent pas être modifiés directement.' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/settings
// @desc    Get global application settings
router.get('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/settings
// @desc    Update global application settings
router.post('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
            settings.updatedAt = Date.now();
        }
        await settings.save();
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
