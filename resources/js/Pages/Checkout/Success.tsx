import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, ArrowRight, ShoppingBag, Printer, MapPin, CreditCard, Calendar, Package, Tag, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderItem {
    id: number;
    quantity: number;
    unit_price: string | number;
    product: {
        id: number;
        name: string;
        thumbnail_url?: string;
    };
    variant?: {
        id: number;
        variant_name: string;
        sku: string;
    };
}

interface Order {
    id: number;
    order_code: string;
    total_amount: string | number;
    shipping_address: string;
    payment_method_id: number;
    payment_status: 'paid' | 'pending' | 'failed';
    order_status: 'pending' | 'processing' | 'completed' | 'cancelled';
    notes?: string;
    discount_amount: string | number;
    created_at: string;
    payment_method?: {
        name: string;
        code: string;
    };
    coupon?: {
        code: string;
        type: 'percent' | 'fixed';
        value: string | number;
    };
    items?: OrderItem[];
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    order_code: string;
    order: Order | null;
}

const Confetti = () => {
    const colors = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const shapes = ['square', 'circle', 'triangle'];

    // Generate particles
    const particles = React.useMemo(() => {
        const arr = [];
        for (let i = 0; i < 120; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const velocity = 10 + Math.random() * 25; // Speed of explosion
            arr.push({
                id: i,
                x: Math.cos(angle) * velocity * 15,
                y: Math.sin(angle) * velocity * 15 - 50, // slightly offset upwards
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                size: 6 + Math.random() * 8,
                delay: Math.random() * 0.4,
                duration: 2.5 + Math.random() * 2.0,
                rotate: Math.random() * 720 - 360,
            });
        }
        return arr;
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[120] overflow-hidden print:hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        opacity: 1,
                        x: '50vw',
                        y: '22vh',
                        scale: 0,
                        rotate: 0
                    }}
                    animate={{
                        opacity: [1, 1, 1, 0.4, 0],
                        x: `calc(50vw + ${p.x}px)`,
                        y: `calc(22vh + ${p.y}px)`,
                        scale: [0, 1.2, 1, 0.8, 0],
                        rotate: p.rotate,
                    }}
                    transition={{
                        delay: p.delay,
                        duration: p.duration,
                        ease: [0.1, 0.8, 0.3, 1], // easeOutExpo shape for explosion
                    }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.shape === 'triangle' ? 0 : p.size,
                        backgroundColor: p.shape === 'triangle' ? 'transparent' : p.color,
                        borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
                        borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
                        borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
                        borderRadius: p.shape === 'circle' ? '50%' : undefined,
                    }}
                />
            ))}
        </div>
    );
};

export default function Success({ order_code, order }: Props) {
    // Phân tích thông tin SĐT từ shipping_address nếu có định dạng "Địa chỉ (SĐT: 09xx)"
    const rawAddress = order?.shipping_address || 'Địa chỉ chưa cập nhật';
    let displayAddress = rawAddress;
    let displayPhone = 'Chưa cung cấp';

    const phoneMatch = rawAddress.match(/\(SĐT:\s*([^\)]+)\)/);
    if (phoneMatch) {
        displayPhone = phoneMatch[1].trim();
        displayAddress = rawAddress.replace(/\(SĐT:\s*[^\)]+\)/, '').trim();
    }

    const subtotal = order ? order.items?.reduce((sum, item) => sum + (Number(item.unit_price) * item.quantity), 0) || 0 : 0;
    const discount = order ? Number(order.discount_amount) : 0;
    const totalAmount = order ? Number(order.total_amount) : 0;

    const getProductImage = (path?: string) => {
        if (!path) return 'https://via.placeholder.com/150';
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout>
            <Head title="Đặt hàng thành công - FlashTech" />
            <Confetti />

            <div className="min-h-screen py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 print:bg-white print:py-0">
                <div className="max-w-3xl mx-auto px-4 print:px-0">

                    {/* --- HIỆU ỨNG THÀNH CÔNG BAN ĐẦU --- */}
                    <div className="text-center mb-12 print:hidden">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-lg shadow-emerald-500/10"
                        >
                            <CheckCircle className="w-12 h-12" strokeWidth={2.5} />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 font-display tracking-tight"
                        >
                            Thanh toán thành công!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-md mx-auto leading-relaxed"
                        >
                            Cảm ơn bạn đã tin dùng FlashTech. Đơn hàng của bạn đã được hệ thống tiếp nhận và xử lý lập tức.
                        </motion.p>
                    </div>

                    {/* --- THẺ HÓA ĐƠN ĐIỆN TỬ (INVOICE CARD) --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden print:border-0 print:shadow-none print:rounded-none"
                    >

                        {/* Họa tiết răng cưa hoặc đường biên của Hóa đơn */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 print:hidden"></div>

                        {/* HEADER HÓA ĐƠN */}
                        <div className="p-8 md:p-12 pb-6 border-b border-dashed border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent font-display tracking-tighter">
                                    FlashTech.
                                </h2>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">HÓA ĐƠN BÁN HÀNG ĐIỆN TỬ</p>
                            </div>

                            <div className="flex flex-col items-end text-left md:text-right w-full md:w-auto">
                                <div className="bg-indigo-50 dark:bg-indigo-500/10 py-2.5 px-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/20 inline-block">
                                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">MÃ ĐƠN HÀNG</span>
                                    <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-base">#{order_code}</span>
                                </div>
                            </div>
                        </div>

                        {/* NÚT THAO TÁC IN NHANH (ẨN KHI IN) */}
                        <div className="absolute right-8 top-32 print:hidden hidden md:block">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 rounded-xl transition-all active:scale-95 shadow-sm"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                In hóa đơn
                            </button>
                        </div>

                        {/* THÔNG TIN CHI TIẾT GIAO DỊCH */}
                        <div className="p-8 md:p-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-dashed border-slate-200 dark:border-slate-800">

                            {/* Cột 1: Thông tin giao hàng */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-2 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                    Thông tin nhận hàng
                                </h3>
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                        {order?.user?.name || 'Khách hàng của FlashTech'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        SĐT: <span className="font-bold">{displayPhone}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        Địa chỉ: {displayAddress}
                                    </p>
                                </div>
                            </div>

                            {/* Cột 2: Thanh toán & Thời gian */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-2 flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                                    Phương thức thanh toán
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {order?.payment_method?.name || 'Thanh toán khi nhận hàng (COD)'}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md ${
                                            order?.payment_status === 'paid'
                                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        }`}>
                                            {order?.payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {order ? new Date(order.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* DANH SÁCH SẢN PHẨM ĐÃ MUA */}
                        <div className="p-8 md:p-12 py-8 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-indigo-500" />
                                Chi tiết sản phẩm
                            </h3>

                            {order?.items && order.items.length > 0 ? (
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-4 py-2">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl flex-shrink-0 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                                    <img
                                                        src={getProductImage(item.product?.thumbnail_url)}
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.product?.name}</h4>
                                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-0.5">
                                                        {item.variant?.variant_name || 'Mặc định'}
                                                    </p>
                                                    <span className="text-[10px] text-indigo-500 font-black">
                                                        x{item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                                    {(Number(item.unit_price) * item.quantity).toLocaleString()}đ
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                    Không tải được thông tin sản phẩm.
                                </div>
                            )}
                        </div>

                        {/* TỔNG KẾT TÀI CHÍNH */}
                        <div className="p-8 md:p-12 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
                            <div className="w-full md:w-80 space-y-3">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <span className="uppercase tracking-wider">Tạm tính</span>
                                    <span>{subtotal.toLocaleString()}đ</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        <span className="uppercase tracking-wider flex items-center gap-1">
                                            <Tag className="w-3 h-3 text-emerald-500" />
                                            Giảm giá {order?.coupon && `(${order.coupon.code})`}
                                        </span>
                                        <span className="text-emerald-500 font-bold">-{discount.toLocaleString()}đ</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <span className="uppercase tracking-wider">Phí vận chuyển</span>
                                    <span className="text-emerald-500 font-bold uppercase text-[9px] tracking-widest">Miễn phí</span>
                                </div>

                                <div className="flex justify-between items-end pt-3">
                                    <span className="font-black font-display text-sm text-slate-700 dark:text-slate-300 uppercase tracking-widest">TỔNG ĐÃ TRẢ</span>
                                    <span className="text-2xl font-black font-display text-indigo-600 dark:text-indigo-400 leading-none">
                                        {totalAmount.toLocaleString()}đ
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* MOCK CHỨNG THỰC BẢO MẬT */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800/80 text-center flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Hóa đơn được bảo chứng mã hóa 256-bit bởi FlashTech</span>
                        </div>

                    </motion.div>

                    {/* --- KHU VỰC ĐIỀU HƯỚNG (NẰM NGOÀI HÓA ĐƠN - ẨN KHI IN) --- */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center print:hidden">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 shadow-xl shadow-slate-900/10 dark:shadow-none text-xs uppercase tracking-widest flex items-center justify-center gap-2 group"
                        >
                            Quay lại trang chủ
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/my-orders"
                            className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 dark:hover:border-indigo-400 font-black rounded-2xl transition-all duration-300 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Lịch sử đơn hàng
                        </Link>

                        <button
                            onClick={handlePrint}
                            className="w-full sm:hidden px-8 py-4 bg-white border border-slate-200 text-slate-700 font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <Printer className="w-4 h-4" />
                            In hóa đơn
                        </button>
                    </div>

                    {/* Footer thương hiệu */}
                    <div className="mt-16 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest print:hidden">
                        FlashTech © {new Date().getFullYear()} • Hỗ trợ khách hàng: 1900 1234
                    </div>

                </div>
            </div>

            {/* INJECT PRINT-ONLY STYLES TO WEB PAGE */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    nav, footer, main > div > div:first-child, .print\\:hidden {
                        display: none !important;
                    }
                    main {
                        padding-top: 0 !important;
                    }
                    .print\\:px-0 {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                    .print\\:border-0 {
                        border: 0 !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                }
            `}} />
        </AppLayout>
    );
}
