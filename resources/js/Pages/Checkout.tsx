import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import {
    CreditCard, MapPin, Phone, MessageSquare, ShieldCheck, ArrowRight,
    Wallet, Banknote, ShoppingBag, Tag, CheckCircle, XCircle, Loader2,
    Truck, Lock, Gift, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface PaymentMethod { id: number; name: string; code: string; }
interface Props { auth: any; paymentMethods: PaymentMethod[]; }

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
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    const filteredPaymentMethods = paymentMethods.filter(m => m.code !== 'momo');

    const handleApplyCoupon = async () => {
        const trimmed = couponCode.trim().toUpperCase();
        if (!trimmed) return;
        setCouponLoading(true); setCouponError(''); setAppliedCoupon(null);
        try {
            const res = await axios.post(route('coupon.apply'), { code: trimmed, order_total: totalPrice });
            if (res.data.status === 'success') { setAppliedCoupon(res.data); setCouponCode(''); }
        } catch (err: any) {
            setCouponError(err?.response?.data?.message || err?.response?.data?.errors?.code?.[0] || 'Có lỗi xảy ra.');
        } finally { setCouponLoading(false); }
    };

    const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponError(''); setCouponCode(''); };

    const handlePlaceOrder = async () => {
        if (!formData.payment_method_id) { setError('Vui lòng chọn phương thức thanh toán.'); return; }
        if (!formData.shipping_address || !formData.phone) { setError('Vui lòng điền đầy đủ thông tin giao hàng.'); return; }
        setLoading(true); setError(null);
        try {
            const res = await axios.post('/checkout', {
                ...formData,
                items: cart.map((item: any) => ({ variant_id: item.variant_id, quantity: item.quantity })),
                coupon_code: appliedCoupon?.coupon_code ?? null,
            });
            if (res.data.status === 'success') {
                setCart([]); setAppliedCoupon(null); localStorage.removeItem('flash_cart');
                if (res.data.payment_url) window.location.href = res.data.payment_url;
                else router.visit('/checkout/success?order_code=' + res.data.order_code);
            }
        } catch (err: any) { setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.'); }
        finally { setLoading(false); }
    };

    const formatPrice = (v: number) => v.toLocaleString('vi-VN') + 'đ';

    const paymentIcons: Record<string, React.ReactNode> = {
        vnpay: <Wallet className="w-5 h-5" />,
        bank_transfer: <Banknote className="w-5 h-5" />,
    };

    // Step indicator
    const steps = ['Giỏ hàng', 'Thanh toán', 'Xác nhận'];

    return (
        <AppLayout>
            <Head title="Thanh toán - FlashTech" />

            <div className="min-h-screen py-6 md:py-10">
                {/* ── Breadcrumb steps ───────────────────────────────────── */}
                <div className="flex items-center gap-2 mb-10 text-xs font-bold">
                    {steps.map((step, i) => (
                        <React.Fragment key={step}>
                            <span className={i === 1 ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-600'}>
                                {step}
                            </span>
                            {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* ── Title ─────────────────────────────────────────────── */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Thanh toán <span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Điền thông tin để hoàn tất đơn hàng của bạn</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 items-start">

                    {/* ── LEFT: Forms ────────────────────────────────────── */}
                    <div className="space-y-6">

                        {/* Shipping info */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                        >
                            {/* Section header */}
                            <div className="px-7 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                                    <MapPin className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-slate-900 dark:text-white">Thông tin giao hàng</h2>
                                    <p className="text-[11px] text-slate-400 font-medium">Địa chỉ nhận hàng và liên lạc</p>
                                </div>
                            </div>

                            <div className="p-7 space-y-5">
                                {/* Address */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        Địa chỉ nhận hàng <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.shipping_address}
                                            onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        Số điện thoại <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="09xx xxx xxx"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        Ghi chú vận chuyển <span className="text-slate-400">(tuỳ chọn)</span>
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Lời nhắn cho nhân viên giao nhận hoặc cấu hình riêng..."
                                            rows={3}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment methods */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                        >
                            <div className="px-7 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-9 h-9 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500">
                                    <CreditCard className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-slate-900 dark:text-white">Phương thức thanh toán</h2>
                                    <p className="text-[11px] text-slate-400 font-medium">Chọn hình thức thanh toán phù hợp</p>
                                </div>
                            </div>

                            <div className="p-7">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {filteredPaymentMethods.map((method) => {
                                        const isSelected = formData.payment_method_id === method.id.toString();
                                        return (
                                            <button
                                                key={method.id}
                                                onClick={() => setFormData({ ...formData, payment_method_id: method.id.toString() })}
                                                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${
                                                    isSelected
                                                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/5'
                                                        : 'border-slate-200 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-800/20 hover:border-indigo-300 dark:hover:border-slate-600'
                                                }`}
                                            >
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                                    isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                                }`}>
                                                    {paymentIcons[method.code] || <Banknote className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-black text-sm transition-colors ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                        {method.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{method.code}</p>
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle className="w-5 h-5 text-indigo-500 fill-indigo-500 text-white flex-shrink-0" strokeWidth={2.5} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: Order Summary ──────────────────────────── */}
                    <div className="sticky top-24 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                            className="bg-slate-900 dark:bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl shadow-slate-950/20"
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-500/15 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-4.5 h-4.5 text-indigo-400" />
                                </div>
                                <h2 className="text-base font-black text-white">Tóm tắt đơn hàng</h2>
                            </div>

                            {/* Cart items */}
                            <div className="p-6 space-y-3 max-h-[240px] overflow-y-auto scrollbar-thin border-b border-slate-800">
                                {cart.map((item) => (
                                    <div key={item.variant_id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center p-1.5 border border-slate-700">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold text-xs truncate">{item.name}</p>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate">{item.variant_name}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 pl-2">
                                            <p className="text-indigo-400 font-black text-xs tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                                            <p className="text-slate-600 text-[10px] mt-0.5">x{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Subtotal + shipping */}
                                <div className="space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Tạm tính</span>
                                        <span className="text-white font-bold tabular-nums">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Vận chuyển</span>
                                        <span className="text-emerald-400 font-black text-xs uppercase tracking-wider">Miễn phí</span>
                                    </div>
                                </div>

                                {/* Coupon */}
                                <div className="pt-3 border-t border-slate-800">
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <Gift className="w-3.5 h-3.5 text-indigo-400" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã giảm giá</span>
                                    </div>

                                    {!appliedCoupon && (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                placeholder="MÃ GIẢM GIÁ..."
                                                disabled={couponLoading}
                                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-[11px] font-semibold uppercase transition-all disabled:opacity-50"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="bg-slate-700 hover:bg-slate-600 text-indigo-400 px-4 py-2.5 rounded-xl font-black text-[11px] transition-all active:scale-95 disabled:opacity-40 flex items-center"
                                            >
                                                {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Áp dụng'}
                                            </button>
                                        </div>
                                    )}

                                    <AnimatePresence>
                                        {couponError && (
                                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                className="mt-2 flex items-center gap-1.5 text-rose-400 text-[11px] font-bold">
                                                <XCircle className="w-3.5 h-3.5" /> {couponError}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {appliedCoupon && (
                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                                className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                                    <div>
                                                        <p className="text-emerald-400 font-black text-xs">{appliedCoupon.coupon_code}</p>
                                                        <p className="text-emerald-500/60 text-[9px] font-bold uppercase">
                                                            {appliedCoupon.type === 'percent' ? `Giảm ${appliedCoupon.value}%` : `Giảm ${Number(appliedCoupon.value).toLocaleString()}đ`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button onClick={handleRemoveCoupon} className="text-slate-500 hover:text-rose-400 transition-colors">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {appliedCoupon && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                className="flex justify-between text-sm font-bold mt-2.5 overflow-hidden">
                                                <span className="text-slate-400">Giảm giá</span>
                                                <span className="text-emerald-400">-{formatPrice(appliedCoupon.discount_amount)}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                                    <span className="text-slate-300 font-bold text-sm">Tổng thanh toán</span>
                                    <motion.span key={finalTotal} initial={{ scale: 1.08, color: '#34d399' }} animate={{ scale: 1, color: '#818cf8' }} transition={{ duration: 0.3 }}
                                        className="text-2xl font-black tabular-nums">
                                        {formatPrice(finalTotal)}
                                    </motion.span>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xs font-bold">
                                            <XCircle className="w-4 h-4 flex-shrink-0" /> {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Place order CTA */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading || cart.length === 0}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98] disabled:scale-100 disabled:shadow-none group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            Xác nhận đặt hàng
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-2 text-slate-600">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Thanh toán bảo mật 100%</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment trust logos placeholder */}
                        <div className="flex items-center justify-center gap-4 px-4 py-3 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Truck className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giao hàng toàn quốc</span>
                            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bảo mật SSL</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Checkout;
