import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

import Step1General from '../components/Register/Step1General';
import Step2Details from '../components/Register/Step2Details';
import Step3Payment from '../components/Register/Step3Payment';



const StepIndicator = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                        ${step === currentStep
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/50 scale-110'
                            : step < currentStep
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'}
                    `}>
                        {step < currentStep ? <Check size={20} /> : step}
                    </div>
                    {step < totalSteps && (
                        <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${step < currentStep ? 'bg-blue-500/30' : 'bg-slate-800'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, user: authUser } = useAuth();
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isStripeRevealed, setIsStripeRevealed] = useState(false);
    const [isReturningUser, setIsReturningUser] = useState(false);

    const [formData, setFormData] = useState({
        nom: '', prenom: '', email: '', telephone: '', password: '', confirmPassword: '',
        ville: '', pays: 'Tunisie', customPays: '',
        role: '',
        dureeParticipation: '2_jours',
        ticketsRepas: 0,
        typeStand: '3m',
        produitsExposes: '',
        nbParticipants: 1,
        additionalParticipants: [],
        modePaiement: 'virement',
        codePromo: '',
        association: ''
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [currency, setCurrency] = useState('TND');
    const [errors, setErrors] = useState({});
    const [priceOverride, setPriceOverride] = useState(null); // prix fixé depuis la DB pour returning user

    // Auto-resume step 3 if requested via URL
    useEffect(() => {
        if (!location.search.includes('step=3')) return;

        if (!authUser) {
            // Non connecté → login puis retour ici
            navigate('/login', { state: { from: { pathname: '/register', search: '?step=3' } } });
            return;
        }

        // Connecté : charger les données fraîches depuis l'API
        const loadReturningUser = async () => {
            try {
                const res = await axios.get('/api/auth/me');
                const dbUser = res.data;
                setFormData(prev => ({
                    ...prev,
                    nom: dbUser.nom || '',
                    prenom: dbUser.prenom || '',
                    email: dbUser.email || '',
                    telephone: dbUser.telephone || '',
                    ville: dbUser.ville || '',
                    pays: dbUser.pays || 'Tunisie',
                    role: dbUser.role || '',
                    dureeParticipation: dbUser.dureeParticipation || '2_jours',
                    ticketsRepas: dbUser.ticketsRepas || 0,
                    typeStand: dbUser.typeStand || '3m',
                    produitsExposes: dbUser.produitsExposes || '',
                    nbParticipants: dbUser.nbParticipants || 1,
                    additionalParticipants: dbUser.additionalParticipants || [],
                    modePaiement: dbUser.modePaiement || 'virement',
                    codePromo: dbUser.codePromo || '',
                    password: '',
                    confirmPassword: ''
                }));
                // Utiliser le prix enregistré en DB, pas le recalcul
                setPriceOverride({ price: dbUser.totalPrice, currency: dbUser.currency || 'TND' });
                setIsReturningUser(true);
                setStep(3);
                navigate('/register', { replace: true });
            } catch (err) {
                console.error('Erreur chargement utilisateur:', err);
                navigate('/login', { state: { from: { pathname: '/register', search: '?step=3' } } });
            }
        };

        loadReturningUser();
    }, [authUser?._id, location.search]);

    useEffect(() => {
        let price = 0;
        let curr = 'TND';
        const isMaghreb = ['Tunisie', 'Algérie', 'Maroc'].includes(formData.pays);

        if (isMaghreb) {
            if (formData.pays === 'Algérie') {
                curr = '€';

                if (formData.role === 'etudiant') {
                    price = formData.dureeParticipation === '2_jours' ? 30 : 15;
                } else if (formData.association && ['Tunisian acadmi', 'ADPC', 'STMOLP'].includes(formData.association)) {
                    // For Algeria with association? The user didn't specify. We fallback to normal praticien price if needed, or 200.
                    price = formData.dureeParticipation === '2_jours' ? 200 : 150;
                } else if (formData.role === 'praticien') {
                    price = formData.dureeParticipation === '2_jours' ? 200 : 150;
                } else if (formData.role === 'assistante') {
                    price = formData.dureeParticipation === '2_jours' ? 90 : 60;
                } else if (formData.role === 'exposant') {
                    price = formData.dureeParticipation === '2_jours' ? 430 : 150;
                }

                // Additional participants
                if (formData.role !== 'exposant' && formData.nbParticipants > 1) {
                    const addParticipants = formData.additionalParticipants || [];
                    const maxAdditional = parseInt(formData.nbParticipants) - 1;
                    for (let i = 0; i < maxAdditional; i++) {
                        const pRole = addParticipants[i]?.role || 'assistante';
                        const pDuree = addParticipants[i]?.dureeParticipation || '2_jours';

                        if (pRole === 'etudiant') price += pDuree === '2_jours' ? 30 : 15;
                        else if (pRole === 'praticien') price += pDuree === '2_jours' ? 200 : 150;
                        else price += pDuree === '2_jours' ? 90 : 60;
                    }
                }

                // Apply Early Bird Discount (20% before April 4, 2026) -> we can keep it
                const today = new Date();
                const deadline = new Date('2026-04-04');
                if (today < deadline && !['etudiant', 'exposant'].includes(formData.role) && !formData.association) {
                    price = Math.round(price * 0.8);
                }

                // Apply Code Promo (20% discount)
                if (formData.codePromo && ['SUMMIT20', 'DOCIC'].includes(formData.codePromo)) {
                    price = Math.round(price * 0.8);
                }

                // --- REPAS (Non remisable) ---
                let totalTickets = parseInt(formData.ticketsRepas) || 0;
                if (formData.role !== 'exposant' && formData.nbParticipants > 1) {
                    const maxAdditional = parseInt(formData.nbParticipants) - 1;
                    if (formData.additionalParticipants) {
                        for (let i = 0; i < maxAdditional; i++) {
                            const p = formData.additionalParticipants[i];
                            if (p) {
                                totalTickets += (parseInt(p.ticketsRepas) || 0);
                            }
                        }
                    }
                }
                price += (totalTickets * 27); // 27€ for Algeria

            } else {
                // Tunisie / Maroc
                curr = 'TND';

                if (formData.role === 'etudiant') {
                    price = formData.dureeParticipation === '2_jours' ? 100 : 50;
                } else if (formData.association && ['Tunisian acadmi', 'ADPC', 'STMOLP'].includes(formData.association)) {
                    price = 500; // Tarif partenaire associations
                } else if (formData.role === 'praticien') {
                    price = formData.dureeParticipation === '2_jours' ? 700 : 500;
                } else if (formData.role === 'assistante') {
                    price = formData.dureeParticipation === '2_jours' ? 300 : 200;
                } else if (formData.role === 'exposant') {
                    price = formData.typeStand === '8m' ? 2500 : 1500;
                }

                // Additional participants
                if (formData.role !== 'exposant' && formData.nbParticipants > 1) {
                    const addParticipants = formData.additionalParticipants || [];
                    const maxAdditional = parseInt(formData.nbParticipants) - 1;
                    for (let i = 0; i < maxAdditional; i++) {
                        const pRole = addParticipants[i]?.role || 'assistante';
                        const pDuree = addParticipants[i]?.dureeParticipation || '2_jours';

                        if (pRole === 'etudiant') price += pDuree === '2_jours' ? 100 : 50;
                        else if (pRole === 'praticien') price += pDuree === '2_jours' ? 700 : 500;
                        else price += pDuree === '2_jours' ? 300 : 200;
                    }
                }

                // Apply Early Bird
                const today = new Date();
                const deadline = new Date('2026-04-04');
                if (today < deadline && !['etudiant', 'exposant'].includes(formData.role) && !formData.association) {
                    price = Math.round(price * 0.8);
                }

                if (formData.codePromo && ['SUMMIT20', 'DOCIC'].includes(formData.codePromo)) {
                    price = Math.round(price * 0.8);
                }

                let totalTickets = parseInt(formData.ticketsRepas) || 0;
                if (formData.role !== 'exposant' && formData.nbParticipants > 1) {
                    const maxAdditional = parseInt(formData.nbParticipants) - 1;
                    if (formData.additionalParticipants) {
                        for (let i = 0; i < maxAdditional; i++) {
                            const p = formData.additionalParticipants[i];
                            if (p) {
                                totalTickets += (parseInt(p.ticketsRepas) || 0);
                            }
                        }
                    }
                }
                price += (totalTickets * 90);
            }
        } else {
            // Europe and others
            curr = '€';
            // Premier participant
            price = (formData.role === 'assistante' ? 300 : 500);

            // Participants supplémentaires
            if (formData.nbParticipants > 1) {
                const addParticipants = formData.additionalParticipants || [];
                const maxAdditional = parseInt(formData.nbParticipants) - 1;
                for (let i = 0; i < maxAdditional; i++) {
                    const pRole = addParticipants[i]?.role || 'assistante';
                    price += (pRole === 'assistante' ? 300 : 500);
                }
            }
        }
        setCurrency(curr);
        setTotalPrice(price);
    }, [formData]);

    // Pour un returning user, on utilise le prix enregistré en DB
    const effectiveTotalPrice = priceOverride ? priceOverride.price : totalPrice;
    const effectiveCurrency = priceOverride ? priceOverride.currency : currency;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'pays') {
            const isTargetMaghreb = ['Tunisie', 'Algérie', 'Maroc'].includes(value);
            if (!isTargetMaghreb) {
                // Si c'est l'Europe (France, etc.), on fixe les options
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    dureeParticipation: '2_jours',
                    ticketsRepas: 2, // 2 jours = 2 repas inclus
                    additionalParticipants: (prev.additionalParticipants || []).map(p => ({
                        ...p,
                        dureeParticipation: '2_jours',
                        ticketsRepas: 2
                    }))
                }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const isMaghreb = ['Tunisie', 'Algérie', 'Maroc'].includes(formData.pays);

    const validateStep1 = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.nom) tempErrors.nom = "Ce champ est obligatoire";
        if (!formData.prenom) tempErrors.prenom = "Ce champ est obligatoire";
        if (!formData.email) tempErrors.email = "L'adresse email est obligatoire";
        else if (!emailRegex.test(formData.email)) tempErrors.email = "Le format de l'email est invalide";
        if (!formData.telephone) tempErrors.telephone = "Le téléphone est obligatoire";
        if (!formData.ville) tempErrors.ville = "La ville est obligatoire";
        if (!formData.password) tempErrors.password = "Le mot de passe est obligatoire";
        else if (formData.password.length < 8) tempErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) tempErrors.password = "Doit contenir une majuscule, une minuscule et un chiffre";
        if (!formData.confirmPassword) tempErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
        else if (formData.confirmPassword !== formData.password) tempErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        if (formData.pays === 'Autre' && !formData.customPays) tempErrors.customPays = "Veuillez préciser votre pays";
        if (!formData.role) tempErrors.role = "Veuillez sélectionner un rôle";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const validateStep2 = () => {
        let tempErrors = { ...errors };
        let isValid = true;

        if (formData.nbParticipants > 1) {
            const addParticipants = formData.additionalParticipants || [];
            const maxAdditional = parseInt(formData.nbParticipants) - 1;
            for (let i = 0; i < maxAdditional; i++) {
                if (!addParticipants[i]?.nom) {
                    tempErrors[`participant_${i}_nom`] = "Le nom est obligatoire";
                    isValid = false;
                }
                if (!addParticipants[i]?.prenom) {
                    tempErrors[`participant_${i}_prenom`] = "Le prénom est obligatoire";
                    isValid = false;
                }
            }
        }
        setErrors(tempErrors);
        return isValid;
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (step === 2 && !validateStep2()) {
            return;
        }
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handlePrev = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleStripeSuccess = (paymentId) => {
        setFormData(prev => ({ ...prev, paymentIntentId: paymentId, paymentStatus: 'paid' }));
        // Automatically submit after successful payment
        setTimeout(() => handleSubmit(paymentId), 500);
    };

    const handleSubmit = async (stripePaymentId = null) => {
        setLoading(true);
        try {
            // --- Utilisateur déjà inscrit : finaliser le paiement uniquement ---
            if (isReturningUser) {
                if (stripePaymentId) {
                    // Valider le paiement Stripe côté serveur
                    await axios.post('/api/payment/finalize', { paymentIntentId: stripePaymentId });
                } else {
                    // Mettre à jour le mode de paiement (virement / espèces)
                    await axios.put('/api/auth/update-payment-mode', { modePaiement: formData.modePaiement });
                }
                setIsSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // --- Nouvelle inscription ---
            const finalPays = formData.pays === 'Autre' ? formData.customPays || 'Autre' : formData.pays;
            const registrationData = {
                ...formData,
                pays: finalPays,
                totalPrice: effectiveTotalPrice,
                currency: effectiveCurrency,
                paymentIntentId: stripePaymentId || formData.paymentIntentId,
                paymentStatus: (stripePaymentId || formData.paymentIntentId) ? 'paid' : 'pending'
            };

            const result = await register(registrationData);
            if (result.success) {
                setIsSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            {t('register.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{t('register.title_highlight')}</span>
                        </h1>
                        <p className="text-lg text-slate-400">{t('register.subtitle')}</p>
                    </div>

                    <StepIndicator currentStep={step} totalSteps={3} />

                    {isReturningUser && step === 3 && (
                        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center gap-3">
                            <span className="text-2xl">👋</span>
                            <div>
                                <p className="text-white font-semibold text-sm">Bienvenue {formData.prenom} {formData.nom}</p>
                                <p className="text-blue-300 text-xs">Vous êtes déjà inscrit(e). Choisissez ou confirmez votre mode de paiement pour finaliser votre inscription.</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-8 md:p-12">
                        {isSuccess ? (
                            <div className="text-center py-12 px-6 animate-fadeIn">
                                <div className="relative mb-10 inline-block">
                                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                                    <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                                        <Check className="w-16 h-16 text-white" strokeWidth={3} />
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                    {t('register.success_title')}
                                </h2>
                                <div className="max-w-md mx-auto space-y-6">
                                    <p className="text-xl text-slate-300 leading-relaxed">
                                        {t('register.success_msg')}
                                    </p>
                                    <p className="text-slate-400">
                                        {t('register.success_welcome')} <span className="text-blue-400 font-semibold">{formData.email}</span>.
                                    </p>
                                    <div className="pt-10">
                                        <button
                                            onClick={() => navigate('/dashboard')}
                                            className="w-full px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center group"
                                        >
                                            {t('register.access_space')} <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    {step === 1 && <Step1General formData={formData} handleChange={handleChange} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
                                    {step === 2 && <Step2Details formData={formData} handleChange={handleChange} setFormData={setFormData} isMaghreb={isMaghreb} totalPrice={effectiveTotalPrice} currency={effectiveCurrency} errors={errors} />}
                                    {step === 3 && (
                                        <Step3Payment
                                            formData={formData}
                                            handleChange={handleChange}
                                            setFormData={setFormData}
                                            totalPrice={effectiveTotalPrice}
                                            currency={effectiveCurrency}
                                            isMaghreb={isMaghreb}
                                            onStripeSuccess={handleStripeSuccess}
                                            setGlobalLoading={setLoading}
                                            isStripeRevealed={isStripeRevealed}
                                        />
                                    )}
                                </form>

                                <div className="flex justify-between mt-12 pt-6 border-t border-slate-800/50">
                                    {step > 1 && !isReturningUser ? (
                                        <button onClick={handlePrev} className="px-8 py-3 rounded-xl flex items-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium">
                                            <ChevronLeft className="mr-2 w-5 h-5" /> {t('register.prev')}
                                        </button>
                                    ) : <div />}

                                    {step < 3 ? (
                                        <button onClick={handleNext} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-blue-900/50 flex items-center transition-all transform hover:scale-105">
                                            {t('register.next')} <ChevronRight className="ml-2 w-5 h-5" />
                                        </button>
                                    ) : (
                                        (!isStripeRevealed || formData.modePaiement !== 'carte') && (
                                            <button onClick={() => setShowSummaryModal(true)} disabled={loading} className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 flex items-center transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                                {loading ? t('register.processing') : "Vérifier et Confirmer"} <Check className="ml-2 w-5 h-5" />
                                            </button>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                        {showSummaryModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn custom-scrollbar">
                                    <div className="p-8 md:p-12">
                                        <h3 className="text-3xl md:text-4xl font-black text-white mb-8 border-b border-slate-800 pb-5">
                                            Récapitulatif de votre inscription
                                        </h3>

                                        <div className="space-y-8">
                                            {/* Informations Générales */}
                                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                                <h4 className="text-blue-400 font-semibold mb-4 text-lg">Informations Personnelles</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                                                    <div><span className="text-slate-400">Nom :</span> <span className="text-white font-medium">{formData.nom} {formData.prenom}</span></div>
                                                    <div><span className="text-slate-400">Email :</span> <span className="text-white font-medium">{formData.email}</span></div>
                                                    <div><span className="text-slate-400">Téléphone :</span> <span className="text-white font-medium">{formData.telephone}</span></div>
                                                    <div>
                                                        <span className="text-slate-400">Rôle :</span>
                                                        <span className="text-white font-medium capitalize"> {formData.role === 'praticien' ? 'Chirurgien-dentiste' : formData.role}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Détails et Tickets */}
                                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                                <h4 className="text-blue-400 font-semibold mb-4 text-lg">Détails de Réservation</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                                                    <div><span className="text-slate-400">Zone :</span> <span className="text-white font-medium">{isMaghreb ? 'Maghreb' : 'Europe'}</span></div>
                                                    <div><span className="text-slate-400">Participants :</span> <span className="text-white font-medium">{formData.nbParticipants || 1}</span></div>
                                                    <div><span className="text-slate-400">Total Tickets Repas :</span> <span className="text-white font-medium">{(parseInt(formData.ticketsRepas) || 0) + formData.additionalParticipants.reduce((sum, p) => sum + (parseInt(p.ticketsRepas) || 0), 0)}</span></div>
                                                </div>

                                                {formData.additionalParticipants.length > 0 && (
                                                    <div className="mt-5 pt-5 border-t border-slate-700/50">
                                                        <span className="text-slate-400 text-base mb-3 block">Accompagnants :</span>
                                                        <ul className="text-base space-y-2">
                                                            {formData.additionalParticipants.map((ap, i) => (
                                                                <li key={i} className="text-slate-300">
                                                                    - <span className="text-white">{ap.prenom} {ap.nom}</span> ({ap.role === 'praticien' ? 'Chirurgien-dentiste' : ap.role})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Paiement */}
                                            <div className="bg-slate-800/50 p-6 rounded-xl border border-blue-500/30">
                                                <h4 className="text-blue-400 font-semibold mb-4 text-lg">Règlement</h4>
                                                <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 p-5 rounded-lg border border-slate-700 gap-4">
                                                    <div className="w-full md:w-auto">
                                                        <span className="text-slate-400 text-base block mb-1">Mode de paiement choisi :</span>
                                                        <span className="text-white font-bold text-xl capitalize">{formData.modePaiement.replace('_', ' ')}</span>
                                                    </div>
                                                    <div className="w-full md:w-auto text-left md:text-right border-t md:border-t-0 border-slate-700/50 pt-4 md:pt-0">
                                                        <span className="text-slate-400 text-base block mb-1">Total :</span>
                                                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{effectiveTotalPrice} {effectiveCurrency}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-5">
                                            <button
                                                onClick={() => setShowSummaryModal(false)}
                                                className="px-8 py-3.5 rounded-xl border-2 border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-semibold text-lg"
                                            >
                                                Retour pour modifier
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowSummaryModal(false);
                                                    if (formData.modePaiement === 'carte') {
                                                        setIsStripeRevealed(true);
                                                    } else {
                                                        handleSubmit();
                                                    }
                                                }}
                                                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-lg transition-all shadow-lg shadow-blue-900/50 transform hover:scale-105"
                                            >
                                                {formData.modePaiement === 'carte' ? "Passer au paiement sécurisé" : "Valider définitivement"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Elements>
    );
};

export default RegisterPage;