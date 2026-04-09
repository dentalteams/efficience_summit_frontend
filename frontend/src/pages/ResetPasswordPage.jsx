import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Les mots de passe ne correspondent pas.');
            return;
        }

        setStatus('loading');
        try {
            await axios.post(`/api/auth/reset-password/${token}`, { password });
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Le lien est invalide ou a expiré.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            
            <div className="relative max-w-md mx-auto">
                <div className="bg-slate-900 border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>
                    
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                            <Lock className="text-blue-400 w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-white">Nouveau Passe</h2>
                        <p className="text-slate-400 mt-2">Définissez votre nouveau mot de passe sécurisé</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Succès !</h3>
                            <p className="text-slate-400">Votre mot de passe a été mis à jour. Redirection vers la connexion...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-center">
                                    <AlertCircle size={18} className="mr-3 flex-shrink-0" />
                                    {message}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Confirmer le passe</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all transform hover:scale-[1.02] disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Mise à jour...' : 'Changer mon mot de passe'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center justify-center">
                            <ArrowLeft size={16} className="mr-2" />
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
