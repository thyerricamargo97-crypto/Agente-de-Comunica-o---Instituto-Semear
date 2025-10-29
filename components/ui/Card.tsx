import React from 'react';

export const Card: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl shadow-lg p-6">
            {children}
        </div>
    );
};
