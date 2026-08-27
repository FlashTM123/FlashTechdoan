import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Laptop } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500 relative overflow-hidden">
            {/* Background ambient gradients */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col items-center max-w-md w-full">
                {/* Logo Section */}
                <Link href="/" className="inline-flex items-center gap-2.5 group mb-8">
                    <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg">
                        <Laptop className="w-6 h-6 text-white dark:text-slate-900" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                        Flash<span className="text-indigo-600">Tech</span>
                    </span>
                </Link>

                {/* Glassmorphic Container Box */}
                <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-indigo-500/5 dark:shadow-none">
                    {children}
                </div>
            </div>
        </div>
    );
}
