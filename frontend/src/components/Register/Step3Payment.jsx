import React from 'react';
import { Building, Banknote, CreditCard, Check } from 'lucide-react';
import FormInput from '../Form/FormInput';
import StripePaymentForm from './StripePaymentForm';

const Step3Payment = ({ formData, handleChange, totalPrice, currency, isMaghreb, setFormData, onStripeSuccess, setGlobalLoading }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Paiement & Validation</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Résumé */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 h-fit">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">Récapitulatif</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-300">
                            <span>Rôle</span>
                            <span className="text-white font-medium capitalize">{formData.role}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                            <span>Zone</span>
                            <span className="text-white font-medium">{isMaghreb ? 'Maghreb' : 'Europe'}</span>
                        </div>
                        {isMaghreb && formData.role !== 'exposant' && (
                            <div className="flex justify-between text-slate-300">
                                <span>Durée</span>
                                <span className="text-white font-medium">{formData.dureeParticipation.replace('_', ' ')}</span>
                            </div>
                        )}
                        {isMaghreb && formData.role === 'exposant' && (
                            <div className="flex justify-between text-slate-300">
                                <span>Stand</span>
                                <span className="text-white font-medium capitalize">{formData.typeStand}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-slate-300">
                            <span>Participants</span>
                            <span className="text-white font-medium">{formData.nbParticipants || 1}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-end">
                            <span className="text-slate-400">Total à payer</span>
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                {totalPrice} {currency}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Paiement */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-blue-100 font-medium mb-2 text-sm">Mode de règlement</label>
                        {(() => {
                            const paymentOptions = isMaghreb
                                ? [
                                    { id: 'virement', label: 'Virement Bancaire', icon: Building },
                                    { id: 'especes', label: 'Espèces (sur place)', icon: Banknote }
                                ]
                                : [
                                    { id: 'virement', label: 'Virement Bancaire', icon: Building },
                                    { id: 'carte', label: 'Carte Bancaire', icon: CreditCard },
                                    { id: 'especes', label: 'Espèces (sur place)', icon: Banknote }
                                ];

                            return paymentOptions.map(method => (
                                <div
                                    key={method.id}
                                    onClick={() => setFormData({ ...formData, modePaiement: method.id })}
                                    className={`
                                        cursor-pointer flex items-center p-4 rounded-xl border transition-all
                                        ${formData.modePaiement === method.id
                                            ? 'border-blue-400 bg-blue-500/20'
                                            : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}
                                    `}
                                >
                                    <div className={`p-2 rounded-lg mr-4 ${formData.modePaiement === method.id ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                        <method.icon size={20} />
                                    </div>
                                    <span className={`font-medium ${formData.modePaiement === method.id ? 'text-white' : 'text-slate-300'}`}>
                                        {method.label}
                                    </span>
                                    {formData.modePaiement === method.id && <Check className="ml-auto text-blue-400" size={20} />}
                                </div>
                            ));
                        })()}

                        {formData.modePaiement === 'virement' && (
                            <div className="mt-4 p-5 bg-blue-950/40 border border-blue-800/50 rounded-xl relative overflow-hidden animate-fadeIn">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                <h4 className="text-white font-bold mb-3 flex items-center">
                                    <Building className="w-5 h-5 mr-2 text-blue-400" />
                                    Coordonnées bancaires
                                </h4>
                                <div className="space-y-2">
                                    {formData.pays === 'Tunisie' ? (
                                        <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 font-mono text-cyan-300 text-sm tracking-wider break-all text-center font-bold">
                                            TN59 0800 2000 6410 6100 8446
                                        </div>
                                    ) : (
                                        <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 font-mono text-cyan-300 text-sm tracking-wider break-all text-center font-bold">
                                            FR76 1009 6181 3000 0528 0620 156
                                        </div>
                                    )}
                                </div>
                                <p className="text-slate-400 text-xs mt-3 italic text-center">
                                    Veuillez indiquer le prénom et nom du participant principal lors du virement pour notre suivi.
                                </p>
                            </div>
                        )}

                        {formData.modePaiement === 'carte' && (
                            <StripePaymentForm 
                                amount={totalPrice} 
                                currency={currency} 
                                email={formData.email} 
                                onSuccess={onStripeSuccess}
                                onLoading={setGlobalLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3Payment;
