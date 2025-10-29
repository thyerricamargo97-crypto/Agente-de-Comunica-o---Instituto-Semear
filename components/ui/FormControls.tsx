import React from 'react';

interface BaseProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: any) => void;
}

const baseInputClasses = "block w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition";

export const Input: React.FC<BaseProps & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, ...props }) => {
    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <input {...props} id={props.name} className={baseInputClasses} />
        </div>
    );
};

export const Textarea: React.FC<BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ label, ...props }) => {
    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <textarea {...props} id={props.name} className={baseInputClasses} />
        </div>
    );
};

interface SelectProps extends BaseProps {
    options: string[];
    optionLabels?: string[];
}

export const Select: React.FC<SelectProps> = ({ label, options, optionLabels, ...props }) => {
    const labels = optionLabels || options;
    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <select {...props} id={props.name} className={baseInputClasses}>
                {options.map((option, index) => (
                    <option key={option} value={option}>{labels[index]}</option>
                ))}
            </select>
        </div>
    );
};