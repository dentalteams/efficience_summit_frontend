import React from 'react';
import { User, Mail, MapPin, Building, Lock, AlertCircle, Stethoscope, Store, GraduationCap } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import FormInput from '../Form/FormInput';
import FormPasswordInput from '../Form/FormPasswordInput';
import FormSelect from '../Form/FormSelect';
import RoleCard from '../Form/RoleCard';

const Step1General = ({ formData, handleChange, setFormData, errors, setErrors }) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Informations Générales</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                    label="Nom" name="nom" value={formData.nom} onChange={handleChange}
                    placeholder="Votre nom" icon={User} required error={errors.nom}
                />
                <FormInput
                    label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange}
                    placeholder="Votre prénom" icon={User} required error={errors.prenom}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                    label="Email" name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="exemple@email.com" icon={Mail} required error={errors.email}
                />
                <div className="mb-4">
                    <label className={`block font-medium mb-2 text-sm ml-1 ${errors.telephone ? 'text-red-400' : 'text-blue-100'}`}>Téléphone</label>
                    <div className="relative">
                        <PhoneInput
                            country={'tn'}
                            value={formData.telephone}
                            onChange={(phone) => {
                                setFormData({ ...formData, telephone: phone });
                                if (errors.telephone) setErrors(prev => ({ ...prev, telephone: null }));
                            }}
                            containerClass="!w-full"
                            inputClass={`!w-full !h-[50px] !bg-slate-900/50 !text-white !rounded-xl !pl-14 !text-base focus:!ring-1 !transition-all ${errors.telephone ? '!border-red-500/50 focus:!border-red-500 focus:!ring-red-500/50' : '!border-slate-700 focus:!border-blue-400 focus:!ring-blue-400/50'}`}
                            buttonClass={`!h-[50px] !bg-slate-900/50 !rounded-l-xl hover:!bg-slate-800 ${errors.telephone ? '!border-red-500/50' : '!border-slate-700'}`}
                            dropdownClass="!bg-slate-900 !text-white !border-slate-700"
                        />
                    </div>
                    {errors.telephone && (
                        <div className="flex items-center text-red-400 text-xs font-bold mt-2 ml-1 animate-fadeIn">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            {errors.telephone}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                    label="Ville" name="ville" value={formData.ville} onChange={handleChange}
                    placeholder="Tunis, Paris, etc." icon={MapPin} required error={errors.ville}
                />
                <div className="space-y-4">
                    <FormSelect
                        label="Pays" name="pays" value={formData.pays} onChange={handleChange}
                        options={[
                            { value: 'Tunisie', label: 'Tunisie' },
                            { value: 'Algérie', label: 'Algérie' },
                            { value: 'Maroc', label: 'Maroc' },
                            { value: 'France', label: 'France' },
                            { value: 'Belgique', label: 'Belgique' },
                            { value: 'Autre', label: 'Autre pays' },
                        ]}
                        icon={Building}
                    />
                    {formData.pays === 'Autre' && (
                        <FormInput
                            label="Veuillez préciser votre pays"
                            name="customPays"
                            value={formData.customPays}
                            onChange={handleChange}
                            placeholder="Entrez votre pays"
                            icon={MapPin}
                            required
                            error={errors.customPays}
                        />
                    )}
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <FormPasswordInput
                    label="Mot de passe" name="password" value={formData.password} onChange={handleChange}
                    icon={Lock} required placeholder="••••••••" error={errors.password}
                />
                <FormPasswordInput
                    label="Confirmer le mot de passe" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    icon={Lock} required placeholder="••••••••" error={errors.confirmPassword}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4">
                <FormSelect
                    label="Association / Partenaire" name="association" value={formData.association} onChange={handleChange}
                    options={[
                        { value: '', label: 'Aucune (Tarif Standard)' },
                        { value: 'Tunisian acadmi', label: 'Tunisian acadmi' },
                        { value: 'ADPC', label: 'ADPC' },
                        { value: 'STMOLP', label: 'STMOLP' },
                    ]}
                    icon={Building}
                />
                <FormInput
                    label="Code Promo" name="codePromo"
                    value={formData.codePromo} onChange={handleChange}
                    placeholder="Entrez votre code"
                    icon={Store}
                />
            </div>
            <div className="pt-4">
                <div className="flex items-center mb-4">
                    <label className={`block font-medium text-sm ml-1 ${errors.role ? 'text-red-400' : 'text-blue-100'}`}>Vous êtes... ?</label>
                    {errors.role && (
                        <div className="flex items-center text-red-400 text-xs font-bold ml-4 animate-fadeIn">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            {errors.role}
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RoleCard
                        role="praticien" title="Praticien" icon={Stethoscope}
                        description="Dentiste, médecin ou chirurgien."
                        selected={formData.role === 'praticien'}
                        onClick={() => setFormData({ ...formData, role: 'praticien' })}
                    />
                    <RoleCard
                        role="assistante" title="Assistante" icon={User}
                        description="Assistant(e) dentaire ou médical(e)."
                        selected={formData.role === 'assistante'}
                        onClick={() => setFormData({ ...formData, role: 'assistante' })}
                    />
                    <RoleCard
                        role="exposant" title="Exposant" icon={Store}
                        description="Présentez vos produits et services."
                        selected={formData.role === 'exposant'}
                        onClick={() => setFormData({ ...formData, role: 'exposant' })}
                    />
                    <RoleCard
                        role="etudiant" title="Étudiant" icon={GraduationCap}
                        description="Étudiant en cours de formation."
                        selected={formData.role === 'etudiant'}
                        onClick={() => setFormData({ ...formData, role: 'etudiant' })}
                    />
                </div>
            </div>
        </div>
    );
};

export default Step1General;
