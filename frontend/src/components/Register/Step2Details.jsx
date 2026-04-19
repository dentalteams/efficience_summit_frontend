import React from 'react';
import { User, Check, Utensils, Briefcase, Calendar } from 'lucide-react';
import FormInput from '../Form/FormInput';
import FormSelect from '../Form/FormSelect';

const Step2Details = ({ formData, handleChange, setFormData, isMaghreb, totalPrice, currency, errors }) => {
    const showParticipants = formData.role !== 'exposant';

    // Europe logic: Fix some defaults but allow the rest of the form to show
    React.useEffect(() => {
        if (!isMaghreb) {
            setFormData(prev => ({
                ...prev,
                dureeParticipation: '2_jours',
                ticketsRepas: 0 // Meal tickets for Europe are included or not handled by count
            }));
        }
    }, [isMaghreb]);

    return (
        <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">
                Détails {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
            </h2>

            {/* Durée pour Non-Exposants (Maghreb) OU Exposant Algérien */}
            {isMaghreb && (formData.role !== 'exposant' || formData.pays === 'Algérie') && (
                <div className="space-y-6 mb-8">
                    <label className="block text-blue-100 font-medium text-sm">Durée de participation</label>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { id: '2_jours', label: 'Les 2 Jours', sub: '15 & 16 Mai' },
                            { id: '1_jour_15', label: '1 Jour', sub: '15 Mai uniquement' },
                            { id: '1_jour_16', label: '1 Jour', sub: '16 Mai uniquement' }
                        ].map(opt => (
                            <div
                                key={opt.id}
                                onClick={() => setFormData({ ...formData, dureeParticipation: opt.id })}
                                className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${formData.dureeParticipation === opt.id
                                    ? 'border-blue-400 bg-blue-500/20 text-white'
                                    : 'border-slate-700 bg-slate-900/50 text-slate-400'
                                    }`}
                            >
                                <div className="font-bold">{opt.label}</div>
                                <div className="text-xs opacity-70">{opt.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Restauration */}
            {isMaghreb && (
                <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700 mb-8">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                        <Utensils className="w-5 h-5 mr-2 text-orange-400" />
                        Restauration
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">Nombre de tickets repas souhaités</span>
                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, ticketsRepas: Math.max(0, parseInt(formData.ticketsRepas) - 1) })}
                                className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600"
                            >
                                -
                            </button>
                            <span className="text-xl font-bold text-white w-8 text-center">{formData.ticketsRepas}</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, ticketsRepas: parseInt(formData.ticketsRepas) + 1 })}
                                className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gestion des Participants - Pour Praticiens et Assistantes */}
            {showParticipants && (
                <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20 mb-8">
                    <h3 className="text-white font-bold mb-4 flex items-center">
                        <User className="w-5 h-5 mr-3 text-blue-400" />
                        Nombre de participants
                    </h3>
                    <FormInput
                        label="Combien de personnes au total ?"
                        name="nbParticipants"
                        type="number"
                        min="1"
                        value={formData.nbParticipants}
                        onChange={handleChange}
                        icon={User}
                    />

                    {parseInt(formData.nbParticipants) > 1 && (
                        <div className="mt-8 space-y-6 pt-6 border-t border-blue-500/30">
                            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider">
                                Identité des participants supplémentaires
                            </p>
                            {[...Array(parseInt(formData.nbParticipants) - 1)].map((_, idx) => (
                                <div key={idx} className="flex flex-col gap-4 p-5 bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-inner">
                                    <div className="text-xs font-black text-cyan-400 flex items-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                                        PARTICIPANT #{idx + 2}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        <FormSelect
                                            label="Rôle professionnel"
                                            options={[
                                                { value: 'assistante', label: 'Assistante' },
                                                { value: 'praticien', label: 'Chirurgien-dentiste' },
                                                { value: 'etudiant', label: 'Étudiant ou interne' }
                                            ]}
                                            value={formData.additionalParticipants?.[idx]?.role || 'assistante'}
                                            onChange={(e) => {
                                                const newList = [...(formData.additionalParticipants || [])];
                                                if (!newList[idx]) newList[idx] = { 
                                                    nom: '', 
                                                    prenom: '', 
                                                    role: 'assistante', 
                                                    dureeParticipation: isMaghreb ? '2_jours' : '2_jours', 
                                                    ticketsRepas: isMaghreb ? 0 : 2 
                                                };
                                                newList[idx].role = e.target.value;
                                                setFormData(prev => ({ ...prev, additionalParticipants: newList }));
                                            }}
                                            icon={Briefcase}
                                        />

                                        {isMaghreb && (
                                            <FormSelect
                                                label="Durée de participation"
                                                options={[
                                                    { value: '2_jours', label: '2 jours (15 & 16 Mai)' },
                                                    { value: '1_jour_15', label: '1 jour (15 Mai)' },
                                                    { value: '1_jour_16', label: '1 jour (16 Mai)' }
                                                ]}
                                                value={formData.additionalParticipants?.[idx]?.dureeParticipation || '2_jours'}
                                                onChange={(e) => {
                                                    const newList = [...(formData.additionalParticipants || [])];
                                                    if (!newList[idx]) newList[idx] = { nom: '', prenom: '', role: 'assistante', dureeParticipation: '2_jours', ticketsRepas: isMaghreb ? 0 : 2 };
                                                    newList[idx].dureeParticipation = e.target.value;
                                                    setFormData(prev => ({ ...prev, additionalParticipants: newList }));
                                                }}
                                                icon={Calendar}
                                            />
                                        )}

                                        {isMaghreb && (
                                            <div className="space-y-2">
                                                <label className="block text-white font-bold text-sm ml-1">Ticket repas</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.additionalParticipants?.[idx]?.ticketsRepas || 0}
                                                    onChange={(e) => {
                                                        const newList = [...(formData.additionalParticipants || [])];
                                                        if (!newList[idx]) newList[idx] = { nom: '', prenom: '', role: 'assistante', dureeParticipation: '2_jours', ticketsRepas: isMaghreb ? 0 : 2 };
                                                        newList[idx].ticketsRepas = Math.max(0, parseInt(e.target.value) || 0);
                                                        setFormData(prev => ({ ...prev, additionalParticipants: newList }));
                                                    }}
                                                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all font-bold"
                                                />
                                                <div className="flex items-center text-white text-xs mt-2 ml-1 font-bold italic">
                                                    <span className="text-orange-400 mr-2 text-sm">⚠️</span> 1 ticket repas / jours / personne
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <FormInput
                                            label="Prénom"
                                            placeholder="Prénom"
                                            required
                                            value={formData.additionalParticipants?.[idx]?.prenom || ''}
                                            error={errors?.[`participant_${idx}_prenom`]}
                                            onChange={(e) => {
                                                const newList = [...(formData.additionalParticipants || [])];
                                                if (!newList[idx]) newList[idx] = { nom: '', prenom: '', role: 'assistante', dureeParticipation: '2_jours', ticketsRepas: isMaghreb ? 0 : 2 };
                                                newList[idx].prenom = e.target.value;
                                                setFormData(prev => ({ ...prev, additionalParticipants: newList }));
                                            }}
                                        />
                                        <FormInput
                                            label="Nom"
                                            placeholder="Nom"
                                            required
                                            value={formData.additionalParticipants?.[idx]?.nom || ''}
                                            error={errors?.[`participant_${idx}_nom`]}
                                            onChange={(e) => {
                                                const newList = [...(formData.additionalParticipants || [])];
                                                if (!newList[idx]) newList[idx] = { nom: '', prenom: '', role: 'assistante', dureeParticipation: '2_jours', ticketsRepas: isMaghreb ? 0 : 2 };
                                                newList[idx].nom = e.target.value;
                                                setFormData(prev => ({ ...prev, additionalParticipants: newList }));
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Section Exposant (Maghreb) */}
            {isMaghreb && formData.role === 'exposant' && (
                <div className="space-y-6">
                    {formData.pays !== 'Algérie' && (
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <label className="block text-blue-100 font-medium mb-4 text-sm">Type de Stand</label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setFormData({ ...formData, typeStand: '3m' })}
                                    className={`cursor-pointer p-4 rounded-xl border transition-all ${formData.typeStand === '3m' ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-700 bg-slate-900'}`}
                                >
                                    <div className="font-bold text-white mb-1">Stand 3M</div>
                                    <div className="text-cyan-400 font-bold text-xl">1 500 TND</div>
                                    <div className="text-xs text-slate-400 mt-2">Entrée 2 jours + Emplacement + Repas</div>
                                </div>
                                <div
                                    onClick={() => setFormData({ ...formData, typeStand: '8m' })}
                                    className={`cursor-pointer p-4 rounded-xl border transition-all ${formData.typeStand === '8m' ? 'border-purple-400 bg-purple-900/20' : 'border-slate-700 bg-slate-900'}`}
                                >
                                    <div className="font-bold text-white mb-1">Stand 8M</div>
                                    <div className="text-purple-400 font-bold text-xl">2 500 TND</div>
                                    <div className="text-xs text-slate-400 mt-2">Grande surface + Équipements complets</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <FormInput
                        label="Que souhaitez-vous exposer ?" name="produitsExposes"
                        value={formData.produitsExposes} onChange={handleChange}
                        placeholder="Équipement dentaire, Logiciels, etc."
                        icon={Briefcase}
                    />
                </div>
            )}
            
            {/* Résumé Dynamique du Prix */}
            <div className="mt-10 pt-6 border-t border-slate-700/50">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="text-blue-100 font-bold text-lg">Total de votre inscription</h4>
                        <p className="text-slate-400 text-sm">Le tarif se met à jour selon vos choix</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            {totalPrice} {currency}
                        </div>
                        {isMaghreb ? (
                            <div className="text-[10px] text-orange-400/80 font-bold uppercase tracking-wider mt-1">
                                Repas : {formData.pays === 'Algérie' ? '27 €' : '90 TND'} / ticket
                            </div>
                        ) : (
                            <div className="text-[10px] text-blue-400/80 font-bold uppercase tracking-wider mt-1">
                                Pack 2 jours + Repas inclus
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2Details;
