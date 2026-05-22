import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 transition-all duration-300 shadow-2xl shadow-indigo-500/5">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-300/30 via-violet-300/20 to-transparent dark:from-indigo-600/30 dark:via-violet-600/20 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-300/20 to-transparent dark:from-cyan-600/20 rounded-full blur-3xl opacity-60"></div>

            <div className="relative grid lg:grid-cols-2 gap-16 items-center px-6 md:px-16 max-w-[1440px] mx-auto">
                {/* Text Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left z-10"
                >
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block px-5 py-2 mb-6 text-[10px] md:text-sm font-black tracking-[0.25em] text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full shadow-sm"
                    >
                        New Arrival {new Date().getFullYear()}
                    </motion.span>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-5xl md:text-7xl lg:text-[5rem] font-black text-slate-900 dark:text-white leading-[1.05] mb-8 font-display tracking-tighter"
                    >
                        Nâng tầm <br className="hidden md:block" /> trải nghiệm <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                            Laptop Next-Gen
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
                    >
                        Khám phá bộ sưu tập Laptop đỉnh cao cho đồ họa, lập trình và gaming.
                        Hiệu năng mạnh mẽ, thiết kế tinh tế vươn tầm tương lai.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                    >
                        <button 
                            onClick={() => document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-10 py-4 lg:py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 shadow-xl shadow-slate-900/20 dark:shadow-none active:scale-95 uppercase tracking-widest text-[11px]"
                        >
                            Mua ngay
                        </button>
                        <button className="w-full sm:w-auto px-10 py-4 lg:py-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-900 dark:text-white font-black rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all duration-300 active:scale-95 uppercase tracking-widest text-[11px]">
                            Xem cấu hình
                        </button>
                    </motion.div>
                </motion.div>

                {/* Image / Hero Graphic */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="relative mt-12 lg:mt-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-cyan-400/30 blur-[80px] rounded-full scale-75 animate-pulse"></div>
                    <motion.img
                        animate={{ y: [-15, 15, -15] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        src="https://images.unsplash.com/photo-1517336712461-68d73859524c?q=80&w=1000&auto=format&fit=crop"
                        onError={(e: any) => { e.target.src = 'https://plus.unsplash.com/premium_photo-1681319553238-9860299dfb0f?q=80&w=1000&auto=format&fit=crop'; e.target.onerror = null; }}
                        alt="Hero Laptop"
                        className="relative z-10 w-full aspect-[4/3] md:aspect-[16/10] bg-slate-200 dark:bg-slate-800 object-cover rounded-[2.5rem] shadow-2xl border-4 border-white/50 dark:border-slate-800/50 backdrop-blur-sm flex items-center justify-center text-slate-400"
                    />
                    
                    {/* Floating badges */}
                    <motion.div 
                        animate={{ y: [10, -10, 10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -top-6 -right-6 lg:-right-12 z-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            🔥
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trending</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Apple M3 Pro</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute -bottom-10 -left-6 lg:-left-12 z-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            ⭐
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đánh giá</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">4.9/5 (2k+)</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
