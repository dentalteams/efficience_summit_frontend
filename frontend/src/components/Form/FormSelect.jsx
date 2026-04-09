import React from 'react';
import { ChevronRight } from 'lucide-react';

const FormSelect = ({ label, icon: Icon, options, ...props }) => (
    <div className="mb-4">
        <label className="block text-blue-100 font-medium mb-2 text-sm ml-1">{label}</label>
        <div className="relative group">
            {Icon && (
                <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
            )}
            <select
                className={`
                    w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3.5 
                    ${Icon ? 'pl-12' : 'pl-4'} pr-10 appearance-none
                    focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 
                    transition-all
                `}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
        </div>
    </div>
);

export default FormSelect;
