import React, { useState, useEffect } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { CreditCard, Lock, ShieldCheck, AlertCircle, Calendar, Hash } from 'lucide-react';

const StripePaymentForm = ({ amount, currency, email, onSuccess, onLoading }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const createIntent = async () => {
            try {
                const response = await axios.post('/api/payment/create-intent', {
                    amount,
                    currency,
                    email
                });
                if (response.data.clientSecret) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setError("Le serveur n'a pas renvoyé de jeton de paiement.");
                }
            } catch (err) {
                const msg = err.response?.data?.message || err.message || "Erreur de connexion au serveur de paiement.";
                setError(`Échec de l'initialisation : ${msg}`);
                console.error("Détails Erreur Stripe:", err.response?.data || err);
            }
        };

        if (amount > 0) createIntent();
    }, [amount, currency, email]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) return;

        setProcessing(true);
        onLoading(true);
        setError(null);

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: { email },
            },
        });

        if (stripeError) {
            setError(stripeError.message);
            setProcessing(false);
            onLoading(false);
        } else if (paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        }
    };

    const elementOptions = {
        style: {
            base: {
                color: "#ffffff",
                fontFamily: 'Inter, sans-serif',
                fontSize: "16px",
                "::placeholder": { color: "#64748b" }
            },
            invalid: { color: "#f87171" }
        }
    };

    return (
        <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-blue-400">
                    <CreditCard size={20} />
                    <span className="font-bold text-white">Détails de la Carte</span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <Lock size={12} />
                    <span>Transaction Sécurisée</span>
                </div>
            </div>

            <div className="space-y-4">

                <div className="group">
                    <label className="block text-slate-400 text-xs font-bold mb-2 ml-1 uppercase tracking-tighter">Numéro de Carte</label>
                    <div className="relative p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 group-focus-within:border-blue-500/50 transition-all flex items-center">
                        <CreditCard className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
                        <div className="w-full"><CardNumberElement options={elementOptions} onChange={(e) => setError(e.error ? e.error.message : "")} /></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div className="group">
                        <label className="block text-slate-400 text-xs font-bold mb-2 ml-1 uppercase tracking-tighter">Expiration</label>
                        <div className="relative p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 group-focus-within:border-blue-500/50 transition-all flex items-center">
                            <Calendar className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
                            <div className="w-full"><CardExpiryElement options={elementOptions} /></div>
                        </div>
                    </div>
                    {/* CVC */}
                    <div className="group">
                        <label className="block text-slate-400 text-xs font-bold mb-2 ml-1 uppercase tracking-tighter">CVC</label>
                        <div className="relative p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 group-focus-within:border-blue-500/50 transition-all flex items-center">
                            <Hash className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
                            <div className="w-full"><CardCvcElement options={elementOptions} /></div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center text-red-400 text-sm bg-red-400/5 p-4 rounded-xl border border-red-400/20">
                    <AlertCircle className="w-4 h-4 mr-3 shrink-0" />
                    {error}
                </div>
            )}

            <button
                type="submit"
                onClick={handleSubmit}
                disabled={!stripe || processing || !clientSecret}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    `Payer ${amount}${currency === '€' ? '€' : ' TND'}`
                )}
            </button>

            <div className="flex items-center justify-center space-x-6 opacity-40 grayscale">
                <img src="data:image/jpeg;base64,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" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <ShieldCheck size={20} className="text-slate-400" />
            </div>
        </div>
    );
};

export default StripePaymentForm;
