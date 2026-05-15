import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Package,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    AlertCircle,
    Calendar,
    CreditCard,
    ArrowLeft,
    Eye,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        thumbnail_url: string;
    };
    variant: {
        id: number;
        variant_name: string;
    };
    quantity: number;
    unit_price: string;
}

interface Order {
    id: number;
    order_code: string;
    total_amount: string;
    order_status: string;
    payment_status: string;
    payment_method: {
        name: string;
    };
    created_at: string;
    items: OrderItem[];
}

interface Props {
    orders: {
        data: Order[];
        links: any[];
    };
    status: string | null;
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
    pending: {
        label: 'Chờ xử lý',
        icon: Clock,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
    },
    processing: {
        label: 'Đang xử lý',
        icon: Package,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    shipping: {
        label: 'Đang giao',
        icon: Truck,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10'
    },
    completed: {
        label: 'Hoàn thành',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    delivered: {
        label: 'Đã giao hàng',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    cancelled: {
        label: 'Đã hủy',
        icon: XCircle,
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/10'
    },
};

const formatVND = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
};

export default function OrderIndex({ orders, status }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleCancelOrder = (orderId: number, orderCode: string) => {
        Swal.fire({
            title: 'Xác nhận hủy đơn?',
            text: `Bạn có chắc chắn muốn hủy đơn hàng ${orderCode}? Hành động này không thể hoàn tác.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Đúng, hủy đơn!',
            cancelButtonText: 'Quay lại',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('orders.cancel', orderId), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        // success handled by useEffect
                        console.log('Order cancelled successfully');
                    }
                });
            }
        });
    };

    const filterOptions = [
        { label: 'Tất cả', value: null },
        { label: 'Chờ xử lý', value: 'pending' },
        { label: 'Đang xử lý', value: 'processing' },
        { label: 'Đang giao', value: 'shipping' },
        { label: 'Đã giao/Hoàn thành', value: 'delivered' },
        { label: 'Đã hủy', value: 'cancelled' },
    ];

    return (
        <AppLayout>
            <Head title="Lịch sử đơn hàng" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Lịch sử đơn hàng</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Theo dõi và quản lý các đơn hàng của bạn.</p>
                    </div>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Tiếp tục mua sắm
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {filterOptions.map((opt) => (
                        <Link
                            key={opt.value ?? 'all'}
                            href={route('orders.index', opt.value ? { status: opt.value } : {})}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2",
                                (status === opt.value || (!status && opt.value === null))
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                            )}
                        >
                            {opt.label}
                        </Link>
                    ))}
                </div>

                {/* Orders List */}
                <div className="grid gap-6">
                    {orders.data.length > 0 ? (
                        orders.data.map((order) => {
                            const config = statusConfig[order.order_status] || statusConfig.pending;
                            const StatusIcon = config.icon;

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden group hover:border-indigo-500/50 transition-all duration-500"
                                >
                                    {/* Order Header */}
                                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-800/20">
                                        <div className="flex items-start gap-4">
                                            <div className={cn("p-4 rounded-3xl", config.bgColor)}>
                                                <StatusIcon className={cn("w-7 h-7", config.color)} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{order.order_code}</span>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                        config.bgColor, config.color, "border-current/20"
                                                    )}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                                                    <span className="flex items-center gap-1.5">
                                                        <CreditCard className="w-4 h-4" />
                                                        {order.payment_method?.name || 'Chưa chọn'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-left md:text-right">
                                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Tổng thanh toán</p>
                                            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                                                {formatVND(order.total_amount)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items Summary */}
                                    <div className="p-6 md:p-8">
                                        <div className="space-y-6">
                                            {order.items.slice(0, 2).map((item) => (
                                                <div key={item.id} className="flex items-center gap-5">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                        <img
                                                            src={item.product?.thumbnail_url || '/placeholder.png'}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                            {item.product?.name}
                                                        </h4>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
                                                            Phân loại: {item.variant?.variant_name || 'Mặc định'}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                                {formatVND(item.unit_price)} <span className="text-slate-400 dark:text-slate-600 font-medium ml-1">x {item.quantity}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {order.items.length > 2 && (
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 pl-2">
                                                    <ChevronRight className="w-4 h-4" />
                                                    Và {order.items.length - 2} sản phẩm khác...
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="p-6 md:p-8 bg-slate-50/30 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-end gap-4">
                                        <Link
                                            href={route('orders.index', { order: order.id })} // Giả sử có trang chi tiết sau này
                                            className="px-6 py-3 rounded-2xl font-bold text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 active:scale-95"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Xem chi tiết
                                        </Link>

                                        {order.order_status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id, order.order_code)}
                                                className="px-6 py-3 rounded-2xl font-bold text-sm bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center gap-2 active:scale-95"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <Package className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Chưa có đơn hàng nào</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm công nghệ tuyệt vời của chúng tôi!</p>
                            <Link
                                href="/products"
                                className="mt-8 inline-flex px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                Mua sắm ngay
                            </Link>
                        </div>
                    )}
                </div>

                {/* Simple Pagination */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {orders.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                    link.active
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                                    !link.url && "opacity-50 cursor-not-allowed"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
