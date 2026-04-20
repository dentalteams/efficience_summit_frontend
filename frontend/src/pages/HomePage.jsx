import React, { useState, useRef, useEffect } from 'react';
import { href, useNavigate } from 'react-router-dom';
import { Calendar, Building, User, Clock, Check, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ArrowRight, Heart, ExternalLink } from 'lucide-react';
import { PiCalendarBold } from "react-icons/pi";
import { LuCalendarClock } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';



const VideoCard = ({ video }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Extract YouTube ID to get the automatic thumbnail
    const videoId = video.src.split('embed/')[1]?.split('?')[0];
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return (
        <div className="group cursor-pointer">
            <div className="relative aspect-video bg-slate-950 rounded-3xl overflow-hidden border border-blue-400/20 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500">

                {/* Background Thumbnail - shown while loading and before playing */}
                <div className="absolute inset-0">
                    <img
                        src={thumbUrl}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700"
                    />
                </div>

                {isPlaying ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`${video.src}&autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full z-20 animate-fade-in"
                    />
                ) : (
                    <div className="absolute inset-0 z-10" onClick={() => setIsPlaying(true)}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient} backdrop-blur-[2px] opacity-60 transition-opacity group-hover:opacity-40`}></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl scale-150 group-hover:scale-175 transition-transform duration-500"></div>
                                <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-1.5"></div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                            <p className="text-white font-black text-2xl mb-1 tracking-tight">{video.title}</p>
                            <div className="flex items-center space-x-3">
                                <p className="text-blue-300/80 text-sm font-medium flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1" /> {video.duration}
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-6 right-6 px-4 py-1.5 bg-blue-600/20 backdrop-blur-xl rounded-full border border-blue-400/30">
                            <p className="text-blue-200 text-[10px] font-black tracking-widest uppercase">HD</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-black overflow-hidden">


            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTQwYWYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNGgydjJoLTJ2LTJ6bTAtMmgtMnYyaDJ2LTJ6bTItMnYyaDJ2LTJoLTJ6bS0yIDB2LTJoMnYyaC0yem0tMiAwSDMydjJoMnYtMnptMC0ydjJoMnYtMmgtMnptMC0yaDJ2LTJoLTJ2MnptLTItMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            </div>


            <div className="relative z-10 pt-32 pb-24 px-4">
                <div className="max-w-7xl mx-auto">

                    <div className="flex justify-center mb-8 animate-fade-in-up">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-400/30 rounded-full backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <span className="relative flex items-center space-x-2">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-amber-200 font-bold text-sm tracking-wider uppercase">{t('home.subtitle')}</span>
                            </span>
                        </div>
                    </div>


                    <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
                        <h1 className="text-7xl md:text-9xl font-black mb-4 leading-none">
                            <span className="block text-white tracking-tight">EFFICIENCE</span>
                            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
                                SUMMIT 2026
                            </span>
                        </h1>
                        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 mx-auto rounded-full mt-8 animate-pulse"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-40 animate-fade-in-up animation-delay-800">
                        <button
                            onClick={() => navigate('/register')}
                            className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/50 overflow-hidden transition-all duration-300 hover:shadow-blue-500/70 hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center justify-center space-x-3">
                                <span>{t('nav.reserve')}</span>
                                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>
                        <br />
                    </div>

                    <div className="text-center mb-16 animate-fade-in-up animation-delay-400 max-w-4xl mx-auto">
                        <p className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                            {t('home.title')}
                        </p>
                        <p className="text-xl md:text-2xl text-blue-200 leading-relaxed mb-4">
                            {t('home.experience')}
                        </p>
                        <p className="text-lg text-cyan-300/80 max-w-3xl md:text-2xl mx-auto">
                            {t('home.description')}
                        </p>
                    </div>


                    <div className="flex justify-center mb-16 animate-fade-in-up animation-delay-600">
                        <div className="bg-gradient-to-br from-slate-900/90 via-blue-900/50 to-slate-900/90 backdrop-blur-2xl border border-blue-400/30 rounded-3xl p-8 md:p-10 shadow-2xl max-w-3xl w-full relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/30 rotate-3 group-hover:rotate-6 transition-transform">
                                            <Calendar className="text-white w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-cyan-300 text-sm font-semibold uppercase tracking-wide mb-1">{t('home.dates_label')}</p>
                                            <p className="text-3xl font-black text-white">15 & 16</p>
                                            <p className="text-xl font-bold text-blue-200">Mai 2026</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 -rotate-3 group-hover:-rotate-6 transition-transform">
                                            <Building className="text-white w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-amber-300 text-sm font-semibold uppercase tracking-wide mb-1">{t('home.location_label')}</p>
                                            <p className="text-xl font-black text-white">Iberostar Kuriat Palace</p>
                                            <p className="text-lg font-bold text-blue-200">Monastir, Tunisie ⭐⭐⭐⭐⭐</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-blue-400/20">
                                    <p className="text-center text-blue-300 italic">{t('home.sea_weekend')}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>


            <div className="relative z-10 px-4 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: User, number: '100+', label: t('home.stat1_label'), color: 'from-blue-500 to-cyan-400', delay: '0' },
                            { icon: Building, number: '20+', label: t('home.stat2_label'), color: 'from-cyan-500 to-blue-500', delay: '200' },
                            { icon: LuCalendarClock, number: '48h', label: t('home.stat3_label'), color: 'from-blue-600 to-cyan-500', delay: '400' },
                            { icon: PiCalendarBold, number: '12 mois', label: t('home.stat4_label'), color: 'from-blue-600 to-cyan-500', delay: '600' }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`animate-fade-in-up animation-delay-${stat.delay} md:flex md:flex-col`}
                            >
                                <div className={`group relative bg-gradient-to-br from-slate-900/80 via-blue-900/40 to-slate-900/80 backdrop-blur-2xl border border-blue-400/20 rounded-3xl p-8 hover:border-blue-400/50 transition-all duration-500 overflow-hidden md:flex-1 md:flex md:flex-col md:items-center md:justify-start`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                    <div className="relative z-10">
                                        <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                            <stat.icon className="text-white w-10 h-10" />
                                        </div>
                                        <h3 className="text-5xl font-black text-white mb-3 text-center">{stat.number}</h3>
                                        <p className="text-blue-200 text-center text-lg font-medium">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video Section*/}
            <div id="moments-2025" className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-4">{t('home.video_section_tag')}</p>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                            {t('home.video_section_title')}
                        </h2>
                        <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                            {t('home.video_section_desc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { title: t('home.video1_title'), duration: '3:10', color: 'blue', gradient: 'from-blue-900/50 to-cyan-900/50', src: 'https://www.youtube.com/embed/kLpcoR64e7w?rel=0&modestbranding=1' },
                            {
                                title: t('home.video2_title'), duration: '1:43', color: 'cyan', gradient: 'from-cyan-900/50 to-blue-900/50', src: 'https://www.youtube.com/embed/YbNEvwUEpXI?rel=0&modestbranding=1'
                            }
                        ].map((video, index) => (
                            <VideoCard key={index} video={video} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Hotel Section */}
            <div className="relative z-10 py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-400/30 rounded-full backdrop-blur-xl mb-6">
                            <span className="text-amber-200 font-bold text-sm tracking-wider uppercase flex items-center space-x-2">
                                <span className="text-2xl">⭐</span>
                                <span>{t('home.hotel_tag')}</span>
                                <span className="text-2xl">⭐</span>
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                            Iberostar Kuriat Palace
                        </h2>
                        <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                            {t('home.hotel_desc')}
                        </p>
                    </div>


                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            { title: 'salle à manger', image: '/salle_manger.webp' },
                            { title: 'piscine', image: '/piscine_2.webp' },
                            { title: 'enfants', image: '/enfants.webp' },
                            { title: 'buffet', image: '/buffet.webp' },
                            { title: 'hotel', image: '/piscine.webp' },
                            { title: 'chambre', image: '/chambre.png' },

                        ].map((item, index) => (
                            <div key={index} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-blue-500/20 transition-all duration-500">
                                <div className="absolute inset-0 bg-slate-900">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>


                            </div>
                        ))}
                    </div>


                    <div className="bg-gradient-to-br from-slate-900/90 via-blue-900/50 to-slate-900/90 backdrop-blur-2xl rounded-3xl border border-amber-400/30 p-6 md:p-14 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-32 -mt-32"></div>
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">{t('home.hotel_excellence')}</h3>
                                <div className="space-y-5">
                                    {[
                                        t('home.hotel_feature1'),
                                        t('home.hotel_feature2'),
                                        t('home.hotel_feature3'),
                                        t('home.hotel_feature4')
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-start group">
                                            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mr-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                                <Check className="text-white w-4 h-4" />
                                            </div>
                                            <p className="text-blue-100 text-lg leading-relaxed">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative w-full">
                                <div className="aspect-video md:aspect-square bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-3xl border border-amber-400/30 flex flex-col items-center justify-center p-6 md:p-8 backdrop-blur-xl">
                                    <div className="text-5xl md:text-7xl mb-6">
                                        ⭐⭐⭐⭐⭐
                                    </div>
                                    <p className="text-amber-200 font-black text-2xl md:text-3xl mb-2">{t('home.hotel_excellence')}</p>
                                    <p className="text-amber-300/80 text-base md:text-lg">{t('home.hotel_certified')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />



        </div>


    );
};

export default HomePage;