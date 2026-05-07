import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="relative py-20 overflow-hidden bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 transition-all duration-300 shadow-sm">
            {/* Trang trí nền */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>

            <div className="relative grid lg:grid-cols-2 gap-12 items-center px-6 md:px-16">
                <div className="text-center lg:text-left">
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-sm font-bold tracking-[0.2em] text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/50 rounded-full">
                        New Arrival {new Date().getFullYear()}
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 font-display tracking-tight">
                        Nâng tầm <br className="hidden md:block" /> trải nghiệm <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                            Laptop Next-Gen
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Khám phá bộ sưu tập Laptop đỉnh cao cho đồ họa, lập trình và gaming.
                        Hiệu năng mạnh mẽ, thiết kế tinh tế.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button 
                            onClick={() => document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95 uppercase tracking-widest text-[11px]"
                        >
                            Mua ngay
                        </button>
                        <button className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-[11px]">
                            Xem cấu hình
                        </button>
                    </div>
                </div>
                <div className="relative group mt-8 lg:mt-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-cyan-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <img
                        src="https://images.unsplash.com/photo-1517336712461-68d73859524c?q=80&w=1000&auto=format&fit=crop"
                        alt="Hero Laptop"
                        className="relative z-10 rounded-[2.5rem] shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                </div>
            </div>
        </section>
    );
}
