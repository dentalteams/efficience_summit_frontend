import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormInput = ({ label, icon: Icon, error, ...props }) => (
    <div className="mb-4">
        <label className={`block font-medium mb-2 text-sm ml-1 ${error ? 'text-red-400' : 'text-blue-100'}`}>{label}</label>
        <div className="relative group">
            {Icon && (
                <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors w-5 h-5 ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-400'}`} />
            )}
            <input
                className={`
                    w-full bg-slate-900/50 border text-white rounded-xl py-3.5 
                    ${Icon ? 'pl-12' : 'pl-4'} pr-4
                    focus:outline-none focus:ring-1 transition-all placeholder-slate-500
                    ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700 focus:border-blue-400 focus:ring-blue-400/50'}
                `}
                {...props}
            />
        </div>
        {error && (
            <div className="flex items-center text-red-400 text-xs font-bold mt-2 ml-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {error}
            </div>
        )}
    </div>
);

export default FormInput;
