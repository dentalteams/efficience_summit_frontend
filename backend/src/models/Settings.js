const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Capacity management
    maxPractitioners: { type: Number, default: 200 },
    maxAssistants: { type: Number, default: 100 },
    maxStudents: { type: Number, default: 50 },
    maxExhibitors: { type: Number, default: 20 },
    
    // Pricing TND
    practitionerPrice: { type: Number, default: 850 },
    assistantPrice: { type: Number, default: 450 },
    studentPrice: { type: Number, default: 300 },
    exhibitorPrice: { type: Number, default: 2500 },

    // Pricing EUR
    practitionerPriceEUR: { type: Number, default: 250 },
    assistantPriceEUR: { type: Number, default: 150 },
    studentPriceEUR: { type: Number, default: 100 },
    exhibitorPriceEUR: { type: Number, default: 750 },
    
    // Event Status
    isRegistrationOpen: { type: Boolean, default: true },
    eventStartDate: { type: Date, default: new Date('2026-05-15') },
    eventEndDate: { type: Date, default: new Date('2026-05-16') },
    
    // Promo Codes (Array for now)
    promoCodes: [{
        code: String,
        discount: Number, // Percentage or Amount
        type: { type: String, enum: ['percentage', 'amount'], default: 'percentage' },
        isActive: { type: Boolean, default: true }
    }],

    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
