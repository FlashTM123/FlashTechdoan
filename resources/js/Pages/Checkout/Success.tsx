import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Success({ order_code }: { order_code: string }) {
    return (
        <AppLayout>
            <Head title="Đặt hàng thành công - FlashTech" />
            <div className="min-h-[70vh] flex items-center justify-center py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[3rem] text-center shadow-2xl border border-slate-100 dark:border-slate-800"
                >
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500">
                        <CheckCircle className="w-12 h-12" strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 font-display tracking-tight">Thành công!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">Đơn hàng của bạn đã được tiếp nhận.</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 py-4 px-6 rounded-3xl inline-block mb-10 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mã đơn hàng</span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg">#{order_code}</span>
                    </div>

                    <div className="space-y-4">
                        <Link 
                            href="/" 
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group"
                        >
                            Tiếp tục mua sắm
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            href={route('orders.index')} 
                            className="w-full py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Xem lịch sử đơn hàng
                        </Link>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                            Cảm ơn bạn đã tin tưởng FlashTech <br />
                            Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
