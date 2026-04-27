import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, X, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            const from = location.state?.from?.pathname || '/dashboard';
            const search = location.state?.from?.search || '';
            const hash = location.state?.from?.hash || '';
            navigate(from + search + hash, { replace: true });
        } else {
            setError(result.error);
        }

        setLoading(false);
    };



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-20 px-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>

            <div className="relative max-w-md mx-auto">
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-white mb-3">{t('login.title')}</h2>
                        <p className="text-blue-200">{t('login.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3">
                            <AlertCircle className="text-red-400 w-5 h-5 flex-shrink-0" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-blue-100 font-semibold mb-2 text-sm">{t('login.email_label')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('login.email_placeholder')}
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-blue-100 font-semibold mb-2 text-sm">{t('login.password_label')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('login.loading') : t('login.submit')}
                        </button>

                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => setIsForgotModalOpen(true)}
                                className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
                            >
                                {t('login.forgot_password')}
                            </button>
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-blue-500/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gradient-to-r from-slate-800 to-slate-900 text-blue-300">{t('login.or')}</span>
                            </div>
                        </div>

                        <Link
                            to="/register"
                            className="block w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold border border-white/20 transition-all text-center"
                        >
                            {t('login.create_account')}
                        </Link>
                    </form>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {isForgotModalOpen && (
                <ForgotPasswordModal onClose={() => setIsForgotModalOpen(false)} />
            )}
        </div>
    );
};

const ForgotPasswordModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setStatus('success');
            setMessage('Un email de réinitialisation vous a été envoyé.');
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Une erreur est survenue.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-white/10 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <Lock className="text-blue-400 w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-white">{t('login.forgot_modal_title')}</h3>
                    <p className="text-slate-400 text-sm mt-2">{t('login.forgot_modal_subtitle')}</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-4">
                        <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />
                        <p className="text-green-300 font-bold mb-6">{message}</p>
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
                        >
                            {t('login.close')}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'error' && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
                                {message}
                            </div>
                        )}
                        <input
                            type="email"
                            placeholder="votre.email@exemple.com"
                            required
                            className="w-full px-4 py-4 bg-slate-950 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                        >
                            {status === 'loading' ? t('login.forgot_sending') : t('login.forgot_send')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;