import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Fail({ order_code }: { order_code: string }) {
    return (
        <AppLayout>
            <Head title="Thanh toán thất bại - FlashTech" />
            <div className="min-h-[70vh] flex items-center justify-center py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[3rem] text-center shadow-2xl border border-slate-100 dark:border-slate-800"
                >
                    <div className="w-24 h-24 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-500">
                        <XCircle className="w-12 h-12" strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 font-display tracking-tight">Thất bại!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">Giao dịch của bạn không thể hoàn tất.</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 py-4 px-6 rounded-3xl inline-block mb-10 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mã đơn hàng (nếu có)</span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-lg">#{order_code || 'N/A'}</span>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 px-4">
                        Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại với phương thức thanh toán khác.
                    </p>

                    <div className="space-y-4">
                        <Link 
                            href="/checkout" 
                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-2 group"
                        >
                            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Thử lại thanh toán
                        </Link>
                        <Link 
                            href="/" 
                            className="w-full py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay về trang chủ
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
