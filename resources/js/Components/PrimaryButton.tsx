import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center px-8 py-3 bg-slate-900 dark:bg-indigo-600 border border-transparent rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95 transition-all duration-300 shadow-xl shadow-indigo-100 dark:shadow-none ${
                    disabled && 'opacity-25'
                } ` + className
            }
        >
            {children}
        </button>
    );
}
