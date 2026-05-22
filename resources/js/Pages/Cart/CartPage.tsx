import React, { useState } from 'react';
import { useCart } from '../../Context/CartContext';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, Tag, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CartPage: React.FC = () => {
    const { cart, totalPrice, removeFromCart, updateQuantity, appliedCoupon, setAppliedCoupon, finalTotal } = useCart();

    // ─── Coupon UI State (local only) ───────────────────────────────
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
            const response = await axios.post(route('coupon.apply'), {
                code: trimmed,
                order_total: totalPrice,
            });

            if (response.data.status === 'success') {
                setAppliedCoupon(response.data);
                setCouponCode('');
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.code?.[0] ||
                'Có lỗi xảy ra, vui lòng thử lại.';
            setCouponError(msg);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
        setCouponCode('');
    };

    return (
        <AppLayout>
            <Head title="Giỏ hàng - FlashTech" />

            <div className="min-h-[70vh] py-12">
                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 px-4 text-center"
                    >
                        <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 shadow-inner">
                            <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700" strokeWidth={1} />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 font-display">Giỏ hàng của bạn đang trống</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 text-lg font-medium">
                            Có vẻ như bạn chưa chọn được chiếc laptop ưng ý nào. Hãy quay lại cửa hàng để khám phá thêm nhé!
                        </p>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                            Tiếp tục mua sắm
                        </Link>
                    </motion.div>
                ) : (
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight">Giỏ hàng <span className="text-indigo-600">.</span></h1>
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{cart.length} sản phẩm</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                            {/* DANH SÁCH SẢN PHẨM */}
                            <div className="lg:col-span-2 space-y-6">
                                {cart.map((item, index) => (
                                    <motion.div
                                        key={item.variant_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] flex flex-col sm:items-center sm:flex-row gap-8 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none"
                                    >
                                        <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-xl" />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.variant_name}</p>

                                            <div className="pt-4 flex items-center gap-6">
                                                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-200/50 dark:border-slate-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-slate-900 dark:text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.variant_id)}
                                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right sm:pl-8">
                                            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">
                                                {(item.price * item.quantity).toLocaleString()}đ
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Đơn giá: {item.price.toLocaleString()}đ</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* TỔNG KẾT ĐƠN HÀNG */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900 dark:bg-slate-900/80 p-8 md:p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-900/20 border border-indigo-500/10 sticky top-32"
                            >
                                <h2 className="text-2xl font-black mb-8 font-display tracking-tight flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-indigo-400" />
                                    Thanh toán
                                </h2>

                                <div className="space-y-5 mb-10">
                                    {/* Tạm tính */}
                                    <div className="flex justify-between text-slate-400 font-bold text-sm">
                                        <span className="uppercase tracking-widest">Tạm tính</span>
                                        <span className="text-white">{totalPrice.toLocaleString()}đ</span>
                                    </div>

                                    {/* Vận chuyển */}
                                    <div className="flex justify-between text-slate-400 font-bold text-sm border-b border-slate-800 pb-5">
                                        <span className="uppercase tracking-widest">Vận chuyển</span>
                                        <span className="text-emerald-400 uppercase tracking-widest text-[10px]">Miễn phí</span>
                                    </div>

                                    {/* Ô nhập mã giảm giá */}
                                    <div className="pt-2 pb-4 border-b border-slate-800">
                                        <span className="uppercase tracking-widest text-slate-400 font-bold text-xs mb-3 flex items-center gap-2">
                                            <Tag className="w-3.5 h-3.5" />
                                            Mã giảm giá
                                        </span>

                                        {/* Nếu chưa áp dụng thành công: hiện input */}
                                        {!appliedCoupon && (
                                            <div className="flex gap-2 mt-3">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        setCouponError('');
                                                    }}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                    placeholder="FLASHTECH2026..."
                                                    disabled={couponLoading}
                                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium uppercase disabled:opacity-50"
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading || !couponCode.trim()}
                                                    className="bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700/50 hover:border-slate-600 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    {couponLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        'Áp dụng'
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Thông báo lỗi */}
                                        <AnimatePresence>
                                            {couponError && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    className="mt-3 flex items-start gap-2 text-rose-400 text-xs font-semibold"
                                                >
                                                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                    <span>{couponError}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Mã đã áp dụng thành công */}
                                        <AnimatePresence>
                                            {appliedCoupon && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, scale: 0.8, rotate: 2 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 relative overflow-hidden"
                                                >
                                                    {/* Hiệu ứng lấp lánh (Shine) khi coupon thành công */}
                                                    <motion.div 
                                                        initial={{ x: "-100%" }}
                                                        animate={{ x: "200%" }}
                                                        transition={{ duration: 1.2, ease: "easeInOut" }}
                                                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent skew-x-[20deg]"
                                                    />
                                                    
                                                    <div className="flex items-center gap-3 min-w-0 relative z-10">
                                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-emerald-400 font-black text-sm tracking-widest truncate">{appliedCoupon.coupon_code}</p>
                                                            <p className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-wider">
                                                                {appliedCoupon.type === 'percent'
                                                                    ? `Giảm ${appliedCoupon.value}%`
                                                                    : `Giảm ${Number(appliedCoupon.value).toLocaleString()}đ`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={handleRemoveCoupon}
                                                        className="text-slate-500 hover:text-rose-400 transition-colors flex-shrink-0 bg-slate-800 hover:bg-rose-500/10 p-2 rounded-xl relative z-10"
                                                        title="Xóa mã"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Dòng giảm giá (chỉ hiện khi có coupon) */}
                                    <AnimatePresence>
                                        {appliedCoupon && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex justify-between text-sm font-bold overflow-hidden"
                                            >
                                                <span className="text-slate-400 uppercase tracking-widest">Giảm giá</span>
                                                <span className="text-emerald-400">- {appliedCoupon.discount_amount.toLocaleString()}đ</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Tổng số */}
                                    <div className="flex justify-between items-end text-3xl font-black font-display pt-2">
                                        <span className="text-xl text-slate-300">Tổng số</span>
                                        <motion.span
                                            key={finalTotal}
                                            initial={{ scale: 1.1, color: '#34d399' }}
                                            animate={{ scale: 1, color: '#818cf8' }}
                                            transition={{ duration: 0.4 }}
                                            className="text-indigo-400"
                                        >
                                            {finalTotal.toLocaleString()}đ
                                        </motion.span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full py-5 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white transition-all duration-300 rounded-2xl font-black text-lg shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Tiến hành thanh toán
                                </Link>

                                <p className="text-center text-slate-500 text-[10px] font-bold mt-6 uppercase tracking-widest leading-loose">
                                    Miễn phí hoàn trả trong 30 ngày <br />
                                    Bảo mật thông tin thanh toán 100%
                                </p>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default CartPage;
