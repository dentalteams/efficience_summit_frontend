import React from 'react';
import { Check } from 'lucide-react';

const RoleCard = ({ selected, role, icon: Icon, title, description, onClick }) => (
    <div
        onClick={onClick}
        className={`group cursor-pointer relative p-6 rounded-3xl border backdrop-blur-xl transition-all duration-500 overflow-hidden flex flex-col items-center text-center h-full
            ${selected
                ? 'border-cyan-400 bg-gradient-to-b from-blue-600/20 to-cyan-900/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                : 'border-slate-700/50 bg-slate-800/30 hover:border-blue-500/50 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-blue-500/20'
            }
        `}
    >
        {/* Animated Glow on hover or selected */}
        <div className={`absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-0 transition-opacity duration-500 pointer-events-none 
            ${selected ? 'opacity-20' : 'group-hover:opacity-10'}
        `} />

        {selected && (
            <div className="absolute top-3 flex items-center justify-center inset-x-0">
               <div className="w-10 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_10px_#22d3ee]"></div>
            </div>
        )}
        {selected && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full p-1 shadow-lg shadow-cyan-500/50 animate-bounce">
                <Check size={14} className="text-white" />
            </div>
        )}

        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 relative z-10 shrink-0
            ${selected 
                ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-xl shadow-cyan-500/40 scale-110' 
                : 'bg-slate-800 border border-slate-700 text-slate-400 group-hover:scale-110 group-hover:text-blue-400 group-hover:border-blue-500/50'}
        `}>
            <Icon size={28} className="relative z-10" />
        </div>
        
        <h3 className={`font-black tracking-tight text-base md:text-lg lg:text-base xl:text-lg mb-2 relative z-10 transition-colors duration-300 w-full leading-tight
            ${selected ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-100' : 'text-slate-300 group-hover:text-white'}
        `}>
            {title}
        </h3>
        
        {description && (
            <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
                {description}
            </p>
        )}
    </div>
);

export default RoleCard;
