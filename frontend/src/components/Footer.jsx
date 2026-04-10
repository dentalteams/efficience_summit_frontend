import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Mail, Phone, Building, User, ArrowRight, Heart, Instagram, Facebook, Linkedin, Check, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';


const Footer = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (

        <footer className="relative z-10">


            <div className="w-full overflow-hidden leading-[0] rotate-180">
                <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-16 fill-slate-900/80">
                    <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
                </svg>
            </div>


            <div className="bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 border-y border-blue-500/20 backdrop-blur-xl py-10 px-4">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-white font-bold text-xl md:text-2xl">{t('footer.limited')}</p>
                        <p className="text-blue-300 text-sm mt-1">{t('footer.earlybird')}</p>
                    </div>
                    <button
                        onClick={() => navigate('/register')}
                        className="flex-shrink-0 group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                    >
                        {t('footer.reserve_now')}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>


            <div className="bg-slate-950/95 backdrop-blur-2xl px-4 pt-16 pb-8">
                <div className="max-w-7xl mx-auto">

                    {/* Grid 4 cols */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

                        {/* Col 1 — Brand */}
                        <div className="lg:col-span-1">
                            <div className="mb-4 -mt-9">
                                <img src="/Logo_SUMMIT.png" alt="Efficience Summit 2026" className="h-24 w-auto object-contain -ml-9" />
                            </div>
                            <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
                                {t('footer.description')}
                            </p>
                            {/* Social links */}
                            <div className="flex items-center gap-3">
                                {[
                                    { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/efficiencedentaire/' },
                                    { Icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/EfficienceD' },
                                    { Icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/efficience-dentaire/posts/?feedView=all' },
                                ].map(({ Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/40 flex items-center justify-center text-blue-300 hover:text-cyan-300 transition-all duration-200"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Col 2 — Navigation */}
                        <div>
                            <p className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-4 h-0.5 bg-cyan-400 inline-block"></span>
                                {t('footer.nav_title')}
                            </p>
                            <ul className="space-y-3">
                                {[
                                    { label: t('nav.home'), href: '/' },
                                    { label: t('nav.program'), href: '/programme' },
                                    { label: t('nav.speakers'), href: '/speakers' },
                                    { label: t('footer.pricing'), href: '/register' },
                                    { label: t('footer.edition2025'), href: '/#moments-2025' },
                                    { label: t('nav.participant'), href: '/login' },
                                ].map(({ label, href }) => (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            className="group flex items-center gap-2 text-blue-200/60 hover:text-cyan-300 text-sm transition-colors duration-200"
                                        >
                                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3 — Infos pratiques */}
                        <div>
                            <p className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-4 h-0.5 bg-amber-400 inline-block"></span>
                                {t('footer.info_title')}
                            </p>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Calendar className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">15 & 16 Mai 2026</p>
                                        <p className="text-blue-300/60 text-xs">{t('footer.full_weekend')}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <MapPin className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">Iberostar Kuriat Palace ★★★★★</p>
                                        <p className="text-blue-300/60 text-xs">{t('footer.sea_view')}</p>
                                    </div>
                                </li>

                            </ul>
                        </div>

                        {/* Col 4 — Contact */}
                        <div>
                            <p className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-4 h-0.5 bg-blue-400 inline-block"></span>
                                {t('footer.contact_title')}
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li>
                                    <a
                                        href="mailto:contact@efficience-summit.tn"
                                        className="group flex items-center gap-3 text-blue-200/60 hover:text-cyan-300 text-sm transition-colors duration-200"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-400/30 flex items-center justify-center flex-shrink-0 transition-all">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        contact-tunisie@efficience-dentaire.fr
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="tel:+21612345678"
                                        className="group flex items-center gap-3 text-blue-200/60 hover:text-cyan-300 text-sm transition-colors duration-200"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-400/30 flex items-center justify-center flex-shrink-0 transition-all">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        +216 55 980 474
                                    </a>
                                </li>
                            </ul>

                            {/* Newsletter mini */}
                            <div>
                                <p className="text-blue-300/70 text-xs mb-3">{t('footer.stay_informed')}</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder={t('footer.your_email')}
                                        className="flex-1 min-w-0 bg-white/5 border border-white/10 focus:border-cyan-400/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-300/40 outline-none transition-colors"
                                    />
                                    <button className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-105">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/5 pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-blue-300/40 text-xs text-center md:text-left">
                                {t('footer.rights')}
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
