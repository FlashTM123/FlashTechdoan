import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { XCircle, ArrowLeft, RefreshCcw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Fail({ order_code, order_id }: { order_code: string; order_id?: number }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleRepay = async () => {
        if (!order_id) {
            // Không có ID đơn hàng thì chuyển hướng về trang checkout thông thường
            window.location.href = '/checkout';
            return;
        }

        try {
            setLoading(true);
            setErrorMsg(null);
            const response = await axios.post(`/orders/${order_id}/repay`);
            if (response.data.status === 'success' && response.data.payment_url) {
                // Chuyển hướng sang trang thanh toán của VNPAY
                window.location.href = response.data.payment_url;
            } else {
                setErrorMsg('Không tìm thấy link thanh toán mới.');
            }
        } catch (error: any) {
            console.error('Lỗi thanh toán lại:', error);
            setErrorMsg(
                error.response?.data?.message || 
                'Có lỗi xảy ra trong quá trình kết nối với cổng thanh toán.'
            );
        } finally {
            setLoading(false);
        }
    };

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
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 py-4 px-6 rounded-3xl inline-block mb-8 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mã đơn hàng cũ</span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-lg">#{order_code || 'N/A'}</span>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-xs font-semibold text-red-600 dark:text-red-400">
                            {errorMsg}
                        </div>
                    )}

                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 px-4">
                        Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại với phương thức thanh toán khác.
                    </p>

                    <div className="space-y-4">
                        <button 
                            onClick={handleRepay}
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            )}
                            {loading ? 'Đang tạo liên kết...' : 'Thử lại thanh toán'}
                        </button>
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
