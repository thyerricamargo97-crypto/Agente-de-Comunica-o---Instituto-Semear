import React from 'react';

const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16v4m-2-2h4m5 16v4m-2-2h4M12 8a4 4 0 110 8 4 4 0 010-8z" />
    </svg>
);

export const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <SparklesIcon />
                        <h1 className="text-xl font-bold text-slate-100">
                           Agente de Comunicações - Instituto Semear
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};
