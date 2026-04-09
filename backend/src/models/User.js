const mongoose = require('mongoose');

const additionalParticipantSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    role: { type: String, enum: ['praticien', 'assistante'], default: 'assistante' },
    dureeParticipation: { type: String, default: '2_jours' },
    ticketsRepas: { type: Number, default: 0 },
    registrationNumber: { type: String },
    qrCode: { type: String }
});

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    password: { type: String, required: true },
    ville: { type: String, required: true },
    pays: { type: String, required: true },
    role: {
        type: String,
        enum: ['praticien', 'assistante', 'exposant', 'etudiant', 'admin'],
        required: true
    },

    // Inscription Details
    dureeParticipation: { type: String },
    ticketsRepas: { type: Number, default: 0 },
    typeStand: { type: String },
    produitsExposes: { type: String },

    // Participants
    nbParticipants: { type: Number, default: 1 },
    additionalParticipants: [additionalParticipantSchema],

    // Payment & Status
    modePaiement: { type: String, required: true },
    codePromo: { type: String },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'TND' },

    paymentIntentId: { type: String },
    registrationNumber: { type: String, unique: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    qrCode: { type: String },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
