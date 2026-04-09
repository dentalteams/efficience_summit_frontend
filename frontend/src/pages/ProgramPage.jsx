import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Star, Users, Coffee, Utensils,
    Monitor, GlassWater, Heart, Eye, TrendingUp,
    Award, Trophy, Zap, ShieldCheck, MapPin,
    ChevronRight, ArrowRight
} from 'lucide-react';
import { LuCalendarClock } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';



const ProgramCard = ({ item, index }) => {
    const IconComponent = {
        Users, Star, Zap, Coffee, ShieldCheck, Utensils,
        Monitor, GlassWater, Heart, Eye, TrendingUp, Award, Trophy
    }[item.icon] || Clock;

    return (
        <div className="group relative mb-8 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="absolute left-0 md:left-24 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-slate-700 to-transparent ml-4 md:ml-0 hidden md:block"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="hidden md:flex flex-col items-end w-24 pr-8 text-right shrink-0">
                    <span className="text-2xl font-black text-white">{item.time}</span>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{item.type}</span>
                </div>


                <div className="flex md:hidden items-center space-x-3 mb-4 w-full bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-xl font-black text-white">{item.time}</span>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest ml-auto">{item.type}</span>
                </div>


                <div className="hidden md:flex absolute left-24 -translate-x-1/2 w-4 h-4 bg-slate-950 border-2 border-blue-500 rounded-full z-10 group-hover:scale-150 group-hover:bg-blue-500 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

                <div className="flex-1 w-full bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 md:ml-12 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 group-hover:-translate-y-1">
                    <div className="flex items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${item.type === 'Keynote' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                                    item.type === 'Workshop' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                                        item.type === 'Pause' || item.type === 'Repas' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                            'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                    }`}>
                                    {item.type}
                                </span>
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-slate-400 text-xs md:text-base leading-relaxed max-w-2xl font-medium">
                                {item.description}
                            </p>
                        </div>
                        <div className={`p-4 rounded-xl bg-slate-950/50 border border-slate-800 hidden sm:flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner ${item.type === 'Keynote' ? 'text-amber-400' : 'text-blue-400'
                            }`}>
                            <IconComponent size={28} strokeWidth={1.5} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgramPage = () => {
    const [activeDay, setActiveDay] = useState(1);
    const { t } = useTranslation();

    const programData = {
        day1: {
            date: t('program.day1_full_date'),
            label: t('program.day1_label'),
            theme: t('program.day1_theme'),
            schedule: [
                { time: "08:30", title: t('program.d1_s1_title'), description: t('program.d1_s1_desc'), type: "Reception", icon: "Users" },
                { time: "09:00", title: t('program.d1_s2_title'), description: t('program.d1_s2_desc'), type: "Conférence", icon: "Users" },
                { time: "10:30", title: t('program.d1_s3_title'), description: t('program.d1_s3_desc'), type: "Pause", icon: "Coffee" },
                { time: "11:00", title: t('program.d1_s4_title'), description: t('program.d1_s4_desc'), type: "Conférence", icon: "Zap" },
                { time: "12:30", title: t('program.d1_s5_title'), description: t('program.d1_s5_desc'), type: "Repas", icon: "Utensils" },
                { time: "14:30", title: t('program.d1_s6_title'), description: t('program.d1_s6_desc'), type: "Conférence", icon: "Monitor" },

                { time: "16:00", title: t('program.d1_s8_title'), description: t('program.d1_s8_desc'), type: "Pause", icon: "Coffee" },
                { time: "16:30", title: t('program.d1_s9_title'), description: t('program.d1_s9_desc'), type: "Conférence", icon: "ShieldCheck" },
                { time: "18:00", title: t('program.d1_s10_title'), description: t('program.d1_s10_desc'), type: "Social", icon: "Users" }
            ]
        },
        day2: {
            date: t('program.day2_full_date'),
            label: t('program.day2_label'),
            theme: t('program.day2_theme'),
            schedule: [
                { time: "09:00", title: t('program.d2_s1_title'), description: t('program.d2_s1_desc'), type: "Conférence", icon: "TrendingUp" },
                { time: "10:30", title: t('program.d2_s2_title'), description: t('program.d2_s2_desc'), type: "Pause", icon: "Coffee" },

                { time: "16:00", title: t('program.d2_s7_title'), description: t('program.d2_s7_desc'), type: "Conférence", icon: "ShieldCheck" },
                { time: "14:30", title: t('program.d2_s6_title'), description: t('program.d2_s6_desc'), type: "Challenge", icon: "Trophy" },

                { time: "17:00", title: t('program.d2_s8_title'), description: t('program.d2_s8_desc'), type: "Cérémonie", icon: "Star" }
            ]
        }
    };

    const currentDay = activeDay === 1 ? programData.day1 : programData.day2;

    return (
        <div className="min-h-screen bg-black pb-20 px-4 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-[450px] md:h-[750px] overflow-hidden">
                <iframe
                    src="https://www.youtube.com/embed/YbNEvwUEpXI?autoplay=1&mute=1&loop=1&playlist=YbNEvwUEpXI&controls=0&showinfo=0&rel=0&vq=hd1080"
                    className="w-full h-full object-cover scale-150 md:scale-125 opacity-90"
                    style={{ pointerEvents: 'none' }}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                ></iframe>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10 pt-32 md:pt-48">

                <div className="text-center mb-24 h-[300px] flex flex-col justify-center">

                </div>


                <div className="flex flex-col md:flex-row justify-center gap-3 mb-12 sticky top-24 z-30 p-1.5 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 animate-fade-in-up shadow-2xl">
                    <button
                        onClick={() => setActiveDay(1)}
                        className={`
                            flex-1 flex items-center justify-between px-6 py-4 md:px-8 md:py-5 rounded-xl transition-all duration-500 group overflow-hidden relative
                            ${activeDay === 1
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 font-black'
                                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-700/50'}
                        `}
                    >
                        <div className="relative z-10 flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${activeDay === 1 ? 'bg-white/20' : 'bg-slate-800'}`}>
                                <Calendar size={20} />
                            </div>
                            <div className="text-left">
                                <span className={`block text-xs uppercase tracking-widest leading-none mb-1 opacity-70`}>{t('program.day1_label')}</span>
                                <span className="block text-lg">{t('program.day1_date')}</span>
                            </div>
                        </div>
                        <ChevronRight className={`relative z-10 transition-transform ${activeDay === 1 ? 'translate-x-0' : 'translate-x-2'}`} />
                        {activeDay === 1 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent animate-shimmer"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveDay(2)}
                        className={`
                            flex-1 flex items-center justify-between px-6 py-4 md:px-8 md:py-5 rounded-xl transition-all duration-500 group overflow-hidden relative
                            ${activeDay === 2
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30 font-black'
                                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-700/50'}
                        `}
                    >
                        <div className="relative z-10 flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${activeDay === 2 ? 'bg-white/20' : 'bg-slate-800'}`}>
                                <Calendar size={20} />
                            </div>
                            <div className="text-left">
                                <span className={`block text-xs uppercase tracking-widest leading-none mb-1 opacity-70`}>{t('program.day2_label')}</span>
                                <span className="block text-lg">{t('program.day2_date')}</span>
                            </div>
                        </div>
                        <ChevronRight className={`relative z-10 transition-transform ${activeDay === 2 ? 'translate-x-0' : 'translate-x-2'}`} />
                        {activeDay === 2 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-shimmer"></div>
                        )}
                    </button>
                </div>

                <div className="mb-10 flex flex-col items-center">
                    <div className={`w-1 h-10 mb-5 rounded-full bg-gradient-to-b ${activeDay === 1 ? 'from-amber-500' : 'from-blue-500'} to-transparent`}></div>
                    <div className="text-center group">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
                            {currentDay.theme}
                        </h2>
                        <p className={`text-lg font-bold ${activeDay === 1 ? 'text-amber-400' : 'text-blue-400'}`}>
                            {currentDay.date}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {currentDay.schedule.map((item, index) => (
                        <ProgramCard key={`${activeDay}-${index}`} item={item} index={index} />
                    ))}
                    <div className="mt-16 p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] backdrop-blur-md animate-fade-in-up">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/40">
                                <Award size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white mb-1">{t('program.attestations_title')}</h4>
                                <p className="text-slate-400 font-medium">
                                    {t('program.attestations_desc')} <span className="text-blue-400 font-bold">{t('program.attestations_highlight')}</span> {t('program.attestations_challenge')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <Footer />
        </div>
    );
};

export default ProgramPage;
