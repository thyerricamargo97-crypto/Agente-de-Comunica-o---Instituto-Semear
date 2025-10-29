import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center px-4 py-2 border border-transparent 
        text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 
        hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-offset-slate-900 focus:ring-sky-500
        disabled:bg-slate-500 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
    >
      {children}
    </button>
  );
};
