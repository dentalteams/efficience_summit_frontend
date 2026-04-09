const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

console.log(`Email Service using: ${process.env.EMAIL_USER} (Password set: ${process.env.EMAIL_PASS ? 'YES' : 'NO'})`);
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper to check if email is configured
const isEmailConfigured = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    return user && pass &&
        user !== 'votre_email@gmail.com' &&
        pass !== 'votre_mot_de_passe_application_ici'
};

const sendRegistrationEmail = async (user, defaultPassword = null) => {
    try {

        const secureQrToken = jwt.sign(
            { id: user._id, regNum: user.registrationNumber, role: user.role },
            process.env.JWT_SECRET
        );
        // Generate QR Code Image as DataURL containing the secure token
        const qrCodeDataUrl = await QRCode.toDataURL(secureQrToken);

        const frontendUrl = process.env.FRONTEND_URL;

        const passwordBlock = defaultPassword ? `
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #856404;"><strong>Accès à votre espace personnel :</strong></p>
                <p style="margin: 5px 0 0 0; color: #856404; font-family: monospace; font-size: 16px;">Mot de passe pro-visoire : <strong>${defaultPassword}</strong></p>
                <p style="margin: 5px 0 0 0; color: #856404; font-size: 13px;">(Veuillez changer ce mot de passe dès votre première connexion)</p>
            </div>
        ` : '';

        console.log(`Tentative d'envoi d'email à: ${user.email} (Sujet: Confirmation d'inscription)`);
        const mailOptions = {
            from: `"Efficience Summit 2026" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Confirmation d\'inscription - Efficience Summit 2026',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">Efficience Summit 2026</h1>
                        <p style="color: rgba(255,255,255,0.8); margin-top: 10px; font-size: 16px;">Votre pass officiel est prêt !</p>
                    </div>
                    
                    <div style="padding: 40px 30px; color: #1e293b;">
                        <h2 style="font-size: 22px; margin-bottom: 20px; color: #0f172a;">Bonjour Dr. ${user.prenom} ${user.nom},</h2>
                        
                        <p style="line-height: 1.6; font-size: 16px; color: #475569;">
                            Nous avons le plaisir de vous confirmer votre inscription au <strong>Summit Efficience 2026</strong>. 
                            Vous trouverez ci-dessous vos informations personnelles ainsi que votre badge d'accès unique sécurisé.
                        </p>

                        ${passwordBlock}

                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #edf2f7;">
                            <h3 style="margin-top: 0; font-size: 18px; color: #2563eb; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Détails de l'événement</h3>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; width: 100px;"><strong>Dates :</strong></td>
                                    <td style="padding: 8px 0; color: #1e293b;">15 & 16 Mai 2026</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;"><strong>Lieu :</strong></td>
                                    <td style="padding: 8px 0; color: #1e293b;">Iberostar Kuriat Palace, Monastir</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;"><strong>Numéro :</strong></td>
                                    <td style="padding: 8px 0; color: #1e293b; font-family: monospace; font-weight: bold;">${user.registrationNumber}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <p style="margin-bottom: 15px; color: #64748b; font-size: 14px;">PRÉSENTEZ CE QR CODE À L'ENTRÉE</p>
                            <img src="${qrCodeDataUrl}" alt="Badge QR Code" style="width: 200px; height: 200px; border: 4px solid #f1f5f9; border-radius: 12px; padding: 10px; background: white;" />
                        </div>

                        <div style="text-align: center; margin-top: 40px;">
                            <a href="${frontendUrl}/dashboard" style="background-color: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Accéder à mon Espace</a>
                        </div>
                    </div>

                    <div style="background-color: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 13px; margin: 0;">&copy; 2026 Efficience Summit 2026. Tous droits réservés.</p>
                        <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">Hôtel Iberostar Kuriat Palace, Skanes, Monastir, Tunisie</p>
                    </div>
                </div>
            `,
            attachDataUrls: true
        };

        if (isEmailConfigured()) {
            await transporter.sendMail(mailOptions);
            return true;
        } else {
            console.log('--- MODE DÉVELOPPEMENT : Email de confirmation simulé ---');
            console.log('Destinataire:', user.email);
            console.log('Badge Code:', user.registrationNumber);
            return true;
        }
    } catch (error) {
        console.error('ERREUR CRITIQUE NODEMAILER:', error.message);
        if (error.code === 'EAUTH') {
            console.error('Erreur d\'authentification Gmail. Vérifiez que l\'email et le mot de passe d\'application sont corrects.');
        } else {
            console.error('Code d\'erreur:', error.code);
        }
        return false;
    }
};

const sendPasswordResetEmail = async (user, resetToken) => {
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"Summit Efficience 2026" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe - Summit Efficience 2026',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                    <div style="background: #2563eb; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">Efficience Summit 2026</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2>Bonjour ${user.prenom},</h2>
                        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Efficience Summit 2026.</p>
                        <p>Veuillez cliquer sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable pendant 1 heure.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Réinitialiser mon mot de passe</a>
                        </div>
                        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
                    </div>
                </div>
            `
        };

        if (isEmailConfigured()) {
            await transporter.sendMail(mailOptions);
            return true;
        } else {
            console.log('--- MODE DÉVELOPPEMENT : Email Reset simulé ---');
            console.log('Lien de réinitialisation:', resetUrl);
            return true;
        }
    } catch (error) {
        console.error('Error sending reset email:', error);
        return false;
    }
};

module.exports = { sendRegistrationEmail, sendPasswordResetEmail, isEmailConfigured };
