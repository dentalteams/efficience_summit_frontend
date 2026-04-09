import React from 'react';
import { Check } from 'lucide-react';

const RoleCard = ({ selected, role, icon: Icon, title, description, onClick }) => (
    <div
        onClick={onClick}
        className={`
            cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
            ${selected
                ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'}
        `}
    >
        <div className="flex items-start justify-between mb-3">
            <div className={`p-3 rounded-xl ${selected ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <Icon size={24} />
            </div>
            {selected && <div className="bg-blue-500 rounded-full p-1"><Check size={12} className="text-white" /></div>}
        </div>
        <h3 className={`font-bold text-lg mb-1 ${selected ? 'text-white' : 'text-slate-200'}`}>{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
);

export default RoleCard;
