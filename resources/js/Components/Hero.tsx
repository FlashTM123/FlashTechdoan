import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="relative py-20 overflow-hidden bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 transition-all duration-300 shadow-sm">
            {/* Trang trí nền */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>

            <div className="relative grid md:grid-cols-2 gap-12 items-center px-8 md:px-16">
                <div>
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/50 rounded-full">
                        New Arrival {new Date().getFullYear()}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6 font-display tracking-tight">
                        Nâng tầm trải nghiệm <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                            Laptop Next-Gen
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        Khám phá bộ sưu tập Laptop đỉnh cao cho đồ họa, lập trình và gaming.
                        Hiệu năng mạnh mẽ, thiết kế tinh tế.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95"
                        >
                            Mua ngay
                        </button>
                        <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            Xem cấu hình
                        </button>
                    </div>
                </div>
                <div className="relative group">
                    <img
                        src="https://images.unsplash.com/photo-1517336712461-68d73859524c?q=80&w=1000&auto=format&fit=crop"
                        alt="Hero Laptop"
                        className="rounded-3xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                    />
                </div>
            </div>
        </section>
    );
}
