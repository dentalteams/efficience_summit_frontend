import React, { useState, useEffect } from 'react';
import { Linkedin, Twitter, ExternalLink, Award, Star, GraduationCap, Microscope, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

const SpeakerCard = ({ speaker, index }) => {
    const [isGray, setIsGray] = useState(false);

    return (
        <div
            className="group relative animate-fade-in-up h-full cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setIsGray(!isGray)}
        >

            <div className={`absolute -inset-4 bg-gradient-to-br ${speaker.color} opacity-0 group-hover:opacity-15 blur-3xl transition-all duration-700 rounded-[3rem]`}></div>

            <div className="relative h-full flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 group-hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className={`relative aspect-[4/5] overflow-hidden transition-all duration-1000 shrink-0 ${isGray ? 'grayscale' : 'grayscale-0'}`}>
                    <img
                        src={speaker.image || 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400&h=500'}
                        alt={speaker.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent transition-opacity duration-700 ${isGray ? 'opacity-20' : 'opacity-60 group-hover:opacity-10'}`}></div>
                </div>


                <div className="p-6 md:p-8 flex flex-col items-center justify-center flex-1 relative z-10 text-center">
                    <h3 className="text-xl md:text-2xl font-extrabold text-white group-hover:text-blue-400 transition-colors leading-tight tracking-tight uppercase min-h-[3rem] flex items-center justify-center">
                        {speaker.name}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mt-4 rounded-full opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500"></div>
                </div>
            </div>
        </div>
    );
};

const SpeakersPage = () => {
    const { t } = useTranslation();
    const speakers = [
        {
            name: "Mr Robert Maccario",
            image: "/intervenants/robert_maccario.png",
            color: "from-blue-600 to-cyan-500",
        },
        {
            name: "Mr Younis Maccario",
            image: "/intervenants/younis_maccario.png",
            color: "from-amber-500 to-orange-400",
        },
        {
            name: "Mme Imen Badri",
            image: "/intervenants/imen_badri.png",
            color: "from-blue-600 to-indigo-400",
        },
        {
            name: "Dr. Arcelin Ben Mahmoud",
            image: "/intervenants/Arcelin.png",
            color: "from-pink-500 to-rose-400",
        },
        {
            name: "Dr. Ahmed Amine Chaabane ",
            image: "/intervenants/chaabane.png",
            color: "from-blue-600 to-red-300",
        },
        {
            name: "Dr. Sandrine Vasserot",
            image: "/intervenants/vasserot.png",
            color: "from-pink-500 to-rose-400",
        },
        {
            name: "Dr. Radia Labed",
            image: "/intervenants/labed.png",
            color: "from-emerald-500 to-teal-400",
        },
        {
            name: "Dr. Malek Ghorbel",
            image: "/intervenants/dr_malek.png",
            color: "from-purple-600 to-pink-500",
        },

        {
            name: "Dr. Omar Marouane ",
            image: "/intervenants/dr_omar.png",
            color: "from-blue-600 to-red-300",
        },
        {
            name: "Dr. Safa Ben Tanfous ",
            image: "/intervenants/dr_safa.png",
            color: "from-blue-600 to-red-300",
        },
        {
            name: "Dr. Anice Necibi",
            image: "/intervenants/Dr_anice.png",
            color: "from-orange-500 to-yellow-400",
        },

    ];

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>

            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24">

                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter animate-fade-in-up">
                        {t('speakers.title_1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">{t('speakers.title_2')}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in-up">
                        {t('speakers.subtitle')}
                    </p>
                </div>


                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {speakers.map((speaker, index) => (
                        <SpeakerCard key={index} speaker={speaker} index={index} />
                    ))}
                </div>

            </div>

            <Footer />


        </div>
    );
};

export default SpeakersPage;
