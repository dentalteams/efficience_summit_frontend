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
        const isPaid = user.paymentStatus === 'paid';
        const statusText = isPaid ? 'PAYÉ' : 'EN ATTENTE';
        const rawToken = `${user.registrationNumber}-${isPaid ? 'VAL' : 'PEND'}-2026`;
        const secureToken = Buffer.from(rawToken).toString('base64').substring(0, 10).toUpperCase();

        const additionalParticipants = user.additionalParticipants || [];
        const totalTickets = (parseInt(user.ticketsRepas) || 0) + additionalParticipants.reduce((sum, p) => sum + (parseInt(p.ticketsRepas) || 0), 0);

        // Liste des accompagnants pour le QR
        let accompagnantQrLines = '';
        if (additionalParticipants.length > 0) {
            accompagnantQrLines = '\nACCOMPAGNANTS:';
            additionalParticipants.forEach((p, i) => {
                const pRole = p.role === 'praticien' ? 'CHIRURGIEN-DENTISTE' : (p.role || 'ASSISTANTE').toUpperCase();
                accompagnantQrLines += `\n  ${i + 1}. ${(p.prenom || '').toUpperCase()} ${(p.nom || '').toUpperCase()} (${pRole}) - Repas: ${parseInt(p.ticketsRepas) || 0}`;
            });
        }

        const qrText = `--- SUMMIT EFFICIENCE 2026 ---
ID: ${user.registrationNumber}
Participant: ${(user.prenom || '').toUpperCase()} ${(user.nom || '').toUpperCase()}
Role: ${user.role === 'praticien' ? 'CHIRURGIEN-DENTISTE' : (user.role || '').toUpperCase()}
Paiement: ${statusText}
Tickets Repas (perso): ${parseInt(user.ticketsRepas) || 0}
Total Tickets (groupe): ${totalTickets}
Nb Accompagnants: ${additionalParticipants.length}${accompagnantQrLines}
------------------------------
SecToken: ${secureToken}`;

        const qrCodeDataUrl = await QRCode.toDataURL(qrText);
        const frontendUrl = process.env.FRONTEND_URL || 'https://summit-efficience.org';

        // Bloc Mot de passe si nouveau compte
        const passwordBlock = defaultPassword ? `
            <div style="background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 0; color: #856404; font-weight: bold;">🔑 Vos accès personnels :</p>
                <p style="margin: 10px 0 0 0; color: #856404; font-family: monospace; font-size: 18px;">Mot de passe : <strong>${defaultPassword}</strong></p>
                <p style="margin: 5px 0 0 0; color: #856404; font-size: 12px;">(Changez-le lors de votre première connexion)</p>
            </div>
        ` : '';

        // Liste html des accompagnants
        let additionalParticipantsHtml = '';
        if (additionalParticipants.length > 0) {
            additionalParticipantsHtml = `
                <div style="margin-top: 15px; padding: 10px; background: #f1f5f9; border-radius: 8px;">
                    <p style="margin:0 0 5px 0; font-weight:bold; font-size:13px; color:#475569;">ACCOMPAGNANTS :</p>
                    <ul style="margin:0; padding-left:15px; font-size:12px; color:#475569;">
                        ${additionalParticipants.map(ap => `
                            <li><strong>${ap.prenom} ${ap.nom}</strong> (${ap.role}) - ${ap.ticketsRepas || 0} repas</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        const mailOptions = {
            from: `"Efficience Summit 2026" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Confirmation d'inscription #${user.registrationNumber} - Efficience Summit`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 35px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 26px; font-weight: 800;">SUMMIT EFFICIENCE 2026</h1>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Votre Pass Digital Officiel</p>
                    </div>

                    <div style="padding: 30px; color: #1e293b;">
                        <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">Bonjour Dr. ${user.prenom} ${user.nom},</h2>
                        <p style="line-height: 1.6; font-size: 15px; color: #475569;">
                            Nous confirmons votre inscription au <strong>Summit Efficience 2026</strong>. Voici les détails de votre pass et votre badge d'accès.
                        </p>

                        ${passwordBlock}

                        <!-- Status Alert -->
                        ${!isPaid ? `
                            <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 15px; margin: 20px 0; border-radius: 12px; text-align: center;">
                                <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 14px;">⚠️ PAIEMENT EN ATTENTE</p>
                                <p style="margin: 5px 0 0 0; color: #991b1b; font-size: 13px;">Merci de finaliser votre règlement par carte ou sur place pour activer votre badge.</p>
                            </div>
                        ` : `
                            <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 15px; margin: 20px 0; border-radius: 12px; text-align: center;">
                                <p style="margin: 0; color: #16a34a; font-weight: bold; font-size: 14px;">✅ INSCRIPTION CONFIRMÉE</p>
                                <p style="margin: 5px 0 0 0; color: #166534; font-size: 13px;">Votre paiement a été validé. À très bientôt à Monastir !</p>
                            </div>
                        `}

                        <!-- Details Table -->
                        <div style="background-color: #f8fafc; border: 1px solid #edf2f7; border-radius: 16px; padding: 20px; margin: 25px 0;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="padding: 6px 0; color: #64748b;">N° Inscription :</td>
                                    <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: bold;">${user.registrationNumber}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #64748b;">Rôle :</td>
                                    <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${user.role?.toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #64748b;">Total à payer :</td>
                                    <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 800; font-size: 16px;">${user.totalPrice || 0} ${user.currency || 'TND'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #64748b;">Tickets Repas :</td>
                                    <td style="padding: 6px 0; color: #0f172a; text-align: right;">${totalTickets} ticket(s)</td>
                                </tr>
                            </table>
                            ${additionalParticipantsHtml}
                        </div>

                        <!-- QR Code Section -->
                        <div style="text-align: center; margin: 30px 0; padding: 20px; border: 2px dashed #e2e8f0; border-radius: 20px;">
                            <p style="margin: 0 0 15px 0; font-weight: bold; color: #64748b; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Badge de contrôle à présenter</p>
                            <img src="${qrCodeDataUrl}" alt="QR Code Badge" style="width: 180px; height: 180px;" />
                            <p style="margin: 10px 0 0 0; font-family: monospace; font-size: 12px; color: #94a3b8;">${secureToken}</p>
                        </div>

                        <!-- Action Button -->
                        <div style="text-align: center; margin-top: 35px;">
                            ${!isPaid ? `
                                <a href="${frontendUrl}/dashboard#payment" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 16px 35px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">💳 Finaliser mon Paiement</a>
                            ` : `
                                <a href="${frontendUrl}/dashboard" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 16px 35px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 16px;">🎫 Accéder à mon Espace</a>
                            `}
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f1f5f9; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: bold;">Hôtel Iberostar Kuriat Palace, Monastir</p>
                        <p style="margin: 5px 0 0 0; font-size: 11px; color: #94a3b8;">&copy; 2026 Efficience Summit 2026. Tous droits réservés.</p>
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
            return true;
        }
    } catch (error) {
        console.error('ERREUR CRITIQUE NODEMAILER:', error.message);
        return false;
    }
};

const sendPasswordResetEmail = async (user, resetToken) => {
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'https://summit-efficience.org';
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
                            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
                        </div>
                        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email password reset error:', error);
        return false;
    }
};

module.exports = {
    sendRegistrationEmail,
    sendPasswordResetEmail
};
