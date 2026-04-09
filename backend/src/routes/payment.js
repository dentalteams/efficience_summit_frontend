const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @route   POST api/payment/create-intent
// @desc    Create a Stripe Payment Intent
// @access  Public
router.post('/create-intent', async (req, res) => {
    try {
        const { amount, currency, email, metadata } = req.body;


        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: currency === '€' ? 'eur' : 'tnd', // User specified euros for this case
            receipt_email: email,
            metadata: metadata || { email },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error('Erreur Stripe:', err.message);
        res.status(500).json({ message: 'Erreur lors de la création du paiement', error: err.message });
    }
});

// @route   POST api/payment/webhook
// @desc    Handle Stripe Webhook Events
// @access  Public
router.post('/webhook', async (req, res) => {
    // This expects raw body in req.body, which we configured in server.js
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (endpointSecret) {

            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {

            event = JSON.parse(req.body.toString());
        }
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        const User = require('../models/User');
        try {

            const user = await User.findOneAndUpdate(
                {
                    $or: [
                        { paymentIntentId: paymentIntent.id },
                        { email: paymentIntent.receipt_email || paymentIntent.metadata.email }
                    ],
                    paymentStatus: { $ne: 'paid' } // Don't update if already paid
                },
                { paymentStatus: 'paid', paymentIntentId: paymentIntent.id },
                { new: true }
            );

            if (user) {
                console.log(`Webhook: Paiement validé pour ${user.email}`);
            } else {


                console.log(`Webhook: Paiement validé mais utilisateur non encore enregistré ou déjà validé (Intent: ${paymentIntent.id})`);
            }
        } catch (dbErr) {
            console.error('Erreur DB dans Webhook Stripe:', dbErr);
        }
    } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        console.log(`Webhook: Paiement échoué pour l'intent ${paymentIntent.id}`);
    }


    res.send();
});

module.exports = router;
