import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, LogOut, Menu, X, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Do not render the public navigation if we are in the admin dashboard (it will have its own sidebar)
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-lg border-b border-blue-800/30 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex justify-between items-center h-20">

                    <Link to="/" className="flex items-center relative z-10">
                        <img src='/Logo_SUMMIT.png' alt='Efficience Summit 2026' className='h-32 w-auto object-contain absolute top-7.5 -translate-y-1/2 left-0 hover:opacity-90 transition-opacity' />
                        <div className="w-55 h-20"></div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/"
                                    className="text-blue-100 hover:text-white transition-colors font-medium"
                                >
                                    {t('nav.home')}
                                </Link>
                                <Link
                                    to="/programme"
                                    className="text-blue-100 hover:text-white transition-colors font-medium"
                                >
                                    {t('nav.program')}
                                </Link>
                                <Link
                                    to="/speakers"
                                    className="text-blue-100 hover:text-white transition-colors font-medium"
                                >
                                    {t('nav.speakers')}
                                </Link>

                                {/* Language Switcher Desktop */}
                                <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1">
                                    <button
                                        onClick={() => i18n.changeLanguage('fr')}
                                        className={`px-3 py-1 rounded-md text-[10px] font-black tracking-tighter transition-all ${i18n.language.startsWith('fr') ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-300 hover:text-white hover:bg-white/5'}`}
                                    >
                                        FR
                                    </button>
                                    <button
                                        onClick={() => i18n.changeLanguage('en')}
                                        className={`px-3 py-1 rounded-md text-[10px] font-black tracking-tighter transition-all ${i18n.language.startsWith('en') ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-300 hover:text-white hover:bg-white/5'}`}
                                    >
                                        EN
                                    </button>
                                </div>

                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20 font-medium"
                                >
                                    {t('nav.participant')}
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all font-bold"
                                >
                                    {t('nav.reserve')}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-blue-100 hover:text-white transition-colors font-medium flex items-center space-x-2"
                                >
                                    <User className="w-4 h-4" />
                                    <span>{t('nav.mySpace')}</span>
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="text-amber-400 hover:text-amber-300 transition-colors font-bold flex items-center space-x-2"
                                    >

                                        <span>{t('nav.admin')}</span>
                                    </Link>
                                )}
                                <div className="text-blue-200 text-sm">
                                    {user?.prenom} {user?.nom}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all border border-red-400/30 font-medium flex items-center space-x-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>{t('nav.logout')}</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-800/95 backdrop-blur-lg border-t border-blue-800/30">
                    <div className="px-4 py-4 space-y-3">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-left px-4 py-3 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {t('nav.home')}
                                </Link>
                                <Link
                                    to="/programme"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-left px-4 py-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border-l-4 border-red-500 font-bold"
                                >
                                    {t('nav.program')}
                                </Link>
                                <Link
                                    to="/speakers"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-left px-4 py-3 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {t('nav.speakers')}
                                </Link>

                                {/* Language Switcher Mobile */}
                                <div className="flex items-center gap-2 px-4 py-2 border-y border-blue-800/30 bg-blue-900/20">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mr-auto">Langue / Language :</span>
                                    <button
                                        onClick={() => { i18n.changeLanguage('fr'); setMobileMenuOpen(false); }}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${i18n.language.startsWith('fr') ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-300 bg-white/5'}`}
                                    >
                                        FR
                                    </button>
                                    <button
                                        onClick={() => { i18n.changeLanguage('en'); setMobileMenuOpen(false); }}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${i18n.language.startsWith('en') ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-300 bg-white/5'}`}
                                    >
                                        EN
                                    </button>
                                </div>

                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-left px-4 py-3 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {t('nav.participant')}
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-bold text-center"
                                >
                                    {t('nav.reserve')}
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="px-4 py-2 text-blue-200 text-sm border-b border-blue-800/30">
                                    {user?.prenom} {user?.nom}
                                </div>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-left px-4 py-3 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {t('nav.mySpace')}
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full text-left px-4 py-3 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors font-bold"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 text-red-200 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                    {t('nav.logout')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;