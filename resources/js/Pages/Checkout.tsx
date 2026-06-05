import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { CreditCard, MapPin, Phone, MessageSquare, ShieldCheck, ArrowRight, Wallet, Banknote, ShoppingBag, Tag, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface PaymentMethod {
    id: number;
    name: string;
    code: string;
}

interface Props {
    auth: any;
    paymentMethods: PaymentMethod[];
}

const Checkout: React.FC<Props> = ({ auth, paymentMethods }) => {
    const { cart, totalPrice, finalTotal, appliedCoupon, setAppliedCoupon, setCart } = useCart();
    const [formData, setFormData] = useState({
        shipping_address: auth.user.profile?.address || '',
        phone: auth.user.profile?.phone || '',
        payment_method_id: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handlePlaceOrder = async () => {
        if (!formData.payment_method_id) {
            setError('Vui lòng chọn phương thức thanh toán.');
            return;
        }
        if (!formData.shipping_address || !formData.phone) {
            setError('Vui lòng điền đầy đủ thông tin giao hàng.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/checkout', {
                ...formData,
                items: cart.map((item: any) => ({
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                })),
                coupon_code: appliedCoupon?.coupon_code ?? null,
            });

            if (response.data.status === 'success') {
                // Xóa giỏ hàng và coupon ở Frontend
                setCart([]);
                setAppliedCoupon(null);
                localStorage.removeItem('flash_cart');

                if (response.data.payment_url) {
                    window.location.href = response.data.payment_url;
                } else {
                    router.visit('/checkout/success?order_code=' + response.data.order_code);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Thanh toán - FlashTech" />

            <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-12"
                    >
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight">Thanh toán <span className="text-indigo-600">.</span></h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* CỘT TRÁI: THÔNG TIN */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* THÔNG TIN NHẬN HÀNG */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-display">Thông tin nhận hàng</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Địa chỉ giao hàng</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.shipping_address}
                                                onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-medium"
                                                placeholder="Số nhà, tên đường, phường/xã..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Số điện thoại</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-medium"
                                                placeholder="09xx xxx xxx"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Ghi chú đơn hàng</label>
                                        <div className="relative group">
                                            <MessageSquare className="absolute left-5 top-5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <textarea
                                                value={formData.notes}
                                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-medium min-h-[120px]"
                                                placeholder="Yêu cầu đặc biệt về đơn hàng..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* PHƯƠNG THỨC THANH TOÁN */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-display">Phương thức thanh toán</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setFormData({...formData, payment_method_id: method.id.toString()})}
                                            className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 group ${
                                                formData.payment_method_id === method.id.toString()
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                                    formData.payment_method_id === method.id.toString()
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                }`}>
                                                    {method.code === 'vnpay' ? <Wallet className="w-6 h-6" /> : <Banknote className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h3 className={`font-black tracking-tight ${
                                                        formData.payment_method_id === method.id.toString() ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'
                                                    }`}>{method.name}</h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{method.code}</p>
                                                </div>
                                            </div>
                                            {formData.payment_method_id === method.id.toString() && (
                                                <div className="absolute top-4 right-4">
                                                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                                        <ShieldCheck className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                        <div className="space-y-8 sticky top-32">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-900/40 border border-indigo-500/20"
                            >
                                <h2 className="text-2xl font-black mb-8 font-display tracking-tight flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-indigo-400" />
                                    Tóm tắt đơn hàng
                                </h2>

                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 mb-10 custom-scrollbar">
                                    {cart.map((item) => (
                                        <div key={item.variant_id} className="flex gap-4">
                                            <div className="w-16 h-16 bg-slate-800 rounded-2xl p-2 flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold truncate">{item.name}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.variant_name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-indigo-400 font-black">x{item.quantity}</span>
                                                    <span className="text-sm font-black">{(item.price * item.quantity).toLocaleString()}đ</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 mb-10 pt-6 border-t border-slate-800">
                                    <div className="flex justify-between text-slate-400 font-bold text-sm">
                                        <span className="uppercase tracking-widest">Tạm tính</span>
                                        <span className="text-white">{totalPrice.toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 font-bold text-sm border-b border-slate-800 pb-5">
                                        <span className="uppercase tracking-widest">Vận chuyển</span>
                                        <span className="text-emerald-400 uppercase tracking-widest text-[10px]">Miễn phí</span>
                                    </div>

                                    {/* ─── Mã giảm giá ─── */}
                                    <div className="pt-2 pb-4 border-b border-slate-800">
                                        <span className="uppercase tracking-widest text-slate-400 font-bold text-xs mb-3 flex items-center gap-2">
                                            <Tag className="w-3.5 h-3.5" />
                                            Mã giảm giá
                                        </span>

                                        {/* Input nhập mã (khi chưa có coupon) */}
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

                                        {/* Badge mã đã áp dụng */}
                                        <AnimatePresence>
                                            {appliedCoupon && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    className="mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
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
                                                        className="text-slate-500 hover:text-rose-400 transition-colors flex-shrink-0"
                                                        title="Xóa mã"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Dòng giảm giá */}
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

                                    <div className="flex justify-between text-3xl font-black font-display pt-4">
                                        <span>Tổng số</span>
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

                                {error && (
                                    <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded-2xl text-xs font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading || cart.length === 0}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-all duration-300 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3 group"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Xác nhận đặt hàng
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-2 mt-8 text-slate-500">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Thanh toán bảo mật 100%</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Checkout;
