import React, { useState } from 'react';
import { useCart } from '../../Context/CartContext';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ShoppingBag, ArrowLeft, Trash2, Plus, Minus,
    CreditCard, Tag, CheckCircle, XCircle, Loader2,
    ArrowRight, ShieldCheck, Truck, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CartPage: React.FC = () => {
    const { cart, totalPrice, removeFromCart, updateQuantity, appliedCoupon, setAppliedCoupon, finalTotal } = useCart();

    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = async () => {
        const trimmed = couponCode.trim().toUpperCase();
        if (!trimmed) return;
        setCouponLoading(true);
        setCouponError('');
        setAppliedCoupon(null);
        try {
            const res = await axios.post(route('coupon.apply'), { code: trimmed, order_total: totalPrice });
            if (res.data.status === 'success') { setAppliedCoupon(res.data); setCouponCode(''); }
        } catch (err: any) {
            setCouponError(err?.response?.data?.message || err?.response?.data?.errors?.code?.[0] || 'Có lỗi xảy ra.');
        } finally { setCouponLoading(false); }
    };

    const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponError(''); setCouponCode(''); };

    const formatPrice = (v: number) => v.toLocaleString('vi-VN') + 'đ';

    return (
        <AppLayout>
            <Head title="Giỏ hàng - FlashTech" />

            <div className="min-h-[70vh]">
                {cart.length === 0 ? (
                    /* ── Empty State ─────────────────────────────────────── */
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-28 px-4 text-center"
                    >
                        <div className="relative mb-8">
                            <div className="w-28 h-28 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-100 dark:shadow-none border border-indigo-100/60 dark:border-indigo-500/15">
                                <ShoppingBag className="w-12 h-12 text-indigo-400 dark:text-indigo-500" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg">0</div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Giỏ hàng trống</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-8 text-sm leading-relaxed">
                            Bạn chưa chọn được sản phẩm nào. Hãy khám phá cửa hàng nhé!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Tiếp tục mua sắm
                        </Link>
                    </motion.div>
                ) : (
                    <div>
                        {/* ── Header ──────────────────────────────────────── */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Giỏ hàng <span className="text-indigo-500">.</span>
                                </h1>
                                <p className="text-slate-400 text-sm mt-1">{cart.length} sản phẩm trong giỏ</p>
                            </div>
                            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Mua thêm
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">

                            {/* ── Cart Items ──────────────────────────────── */}
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {cart.map((item, index) => (
                                        <motion.div
                                            key={item.variant_id}
                                            layout
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -16, height: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/20 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-none transition-all duration-300 overflow-hidden"
                                        >
                                            <div className="flex items-center gap-5 p-5">
                                                {/* Image */}
                                                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300">
                                                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain drop-shadow-md" />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-black text-slate-900 dark:text-white text-sm md:text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                                                        {item.variant_name}
                                                    </p>

                                                    <div className="flex items-center gap-3 mt-3">
                                                        {/* Quantity stepper */}
                                                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-7 text-center font-black text-xs text-slate-900 dark:text-white tabular-nums">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                                                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(item.variant_id)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right flex-shrink-0 pl-4">
                                                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                                            {formatPrice(item.price)} / cái
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Free shipping notice */}
                                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                                    <Truck className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                        🎉 Bạn được <span className="font-black">miễn phí vận chuyển</span> toàn quốc!
                                    </p>
                                </div>
                            </div>

                            {/* ── Order Summary ────────────────────────────── */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="sticky top-24 bg-slate-900 dark:bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl shadow-slate-950/30"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-indigo-500/15 rounded-xl flex items-center justify-center">
                                        <CreditCard className="w-4.5 h-4.5 text-indigo-400" />
                                    </div>
                                    <h2 className="text-base font-black text-white">Tóm tắt đơn hàng</h2>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Subtotal + shipping */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 font-medium">Tạm tính</span>
                                            <span className="text-white font-bold tabular-nums">{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 font-medium">Vận chuyển</span>
                                            <span className="text-emerald-400 font-black text-xs uppercase tracking-wider">Miễn phí</span>
                                        </div>
                                    </div>

                                    {/* Coupon */}
                                    <div className="pt-4 border-t border-slate-800">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Gift className="w-3.5 h-3.5 text-indigo-400" />
                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mã giảm giá</span>
                                        </div>

                                        {!appliedCoupon && (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                    placeholder="FLASHTECH..."
                                                    disabled={couponLoading}
                                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-xs font-semibold uppercase transition-all disabled:opacity-50"
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading || !couponCode.trim()}
                                                    className="bg-slate-700 hover:bg-slate-600 text-indigo-400 hover:text-indigo-300 px-4 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                                                >
                                                    {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Áp dụng'}
                                                </button>
                                            </div>
                                        )}

                                        <AnimatePresence>
                                            {couponError && (
                                                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="mt-2 flex items-center gap-1.5 text-rose-400 text-[11px] font-bold">
                                                    <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {couponError}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            {appliedCoupon && (
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                                    className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/25 rounded-2xl px-4 py-3 overflow-hidden relative">
                                                    <motion.div
                                                        initial={{ x: '-100%' }} animate={{ x: '200%' }}
                                                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                                                        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent skew-x-[15deg] pointer-events-none"
                                                    />
                                                    <div className="flex items-center gap-2.5 relative z-10">
                                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        <div>
                                                            <p className="text-emerald-400 font-black text-xs tracking-widest">{appliedCoupon.coupon_code}</p>
                                                            <p className="text-emerald-500/70 text-[9px] font-bold uppercase tracking-wider">
                                                                {appliedCoupon.type === 'percent' ? `Giảm ${appliedCoupon.value}%` : `Giảm ${Number(appliedCoupon.value).toLocaleString()}đ`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button onClick={handleRemoveCoupon} className="text-slate-500 hover:text-rose-400 transition-colors z-10 bg-slate-800/50 hover:bg-rose-500/10 p-1.5 rounded-lg">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            {appliedCoupon && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                    className="flex justify-between text-sm font-bold mt-3 overflow-hidden">
                                                    <span className="text-slate-400">Giảm giá</span>
                                                    <span className="text-emerald-400">-{formatPrice(appliedCoupon.discount_amount)}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                                        <span className="text-slate-300 font-bold text-sm">Tổng cộng</span>
                                        <motion.span key={finalTotal} initial={{ scale: 1.08, color: '#34d399' }} animate={{ scale: 1, color: '#818cf8' }} transition={{ duration: 0.35 }}
                                            className="text-2xl font-black tabular-nums">
                                            {formatPrice(finalTotal)}
                                        </motion.span>
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href="/checkout"
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98] group"
                                    >
                                        Tiến hành thanh toán
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <div className="flex items-center justify-center gap-2 text-slate-500">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Thanh toán bảo mật 100%</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default CartPage;
