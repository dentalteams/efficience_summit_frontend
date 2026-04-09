import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const FormPasswordInput = ({ label, icon: Icon, value, onChange, name, placeholder, required, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="mb-4">
            <label className={`block font-medium mb-2 text-sm ml-1 ${error ? 'text-red-400' : 'text-blue-100'}`}>{label}</label>
            <div className="relative group">
                {Icon && (
                    <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors w-5 h-5 ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-400'}`} />
                )}
                <input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`
                        w-full bg-slate-900/50 border text-white rounded-xl py-3.5 
                        ${Icon ? 'pl-12' : 'pl-4'} pr-12
                        focus:outline-none focus:ring-1 transition-all placeholder-slate-500
                        ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700 focus:border-blue-400 focus:ring-blue-400/50'}
                    `}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 focus:outline-none"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
            {error && (
                <div className="flex items-center text-red-400 text-xs font-bold mt-2 ml-1 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default FormPasswordInput;
