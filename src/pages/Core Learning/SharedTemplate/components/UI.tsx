import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 text-sm";
  const variants: any = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] px-6 py-3",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-md px-6 py-3",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900 px-6 py-3 bg-white",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-3 py-2",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

export const Badge = ({ children, variant = 'default', className = '' }: any) => {
  const variants: any = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/50",
    dark: "bg-slate-900 text-white",
  };
  return <span className={`px-3 py-1 rounded-md text-[11px] font-black tracking-widest uppercase ${variants[variant]} ${className}`}>{children}</span>;
}
