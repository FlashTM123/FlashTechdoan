import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    MapPin,
    Package,
    Phone,
    User,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    ShoppingBag,
    Tag,
    Receipt,
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
    discount_amount: string;
    original_amount?: string;
    shipping_address: string;
    payment_status: string;
    order_status: string;
    notes: string | null;
    created_at: string;
    items: OrderItem[];
    payment_method: {
        name: string;
    };
    coupon?: {
        code: string;
        discount_value: string;
        type: string;
    };
}

interface Props {
    order: Order;
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bgColor: string; desc: string }> = {
    pending: {
        label: 'Chờ xử lý',
        icon: Clock,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        desc: 'Đơn hàng của bạn đã được tiếp nhận và đang chờ duyệt.'
    },
    processing: {
        label: 'Đang xử lý',
        icon: Package,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        desc: 'Chúng tôi đang đóng gói sản phẩm của bạn để sẵn sàng giao.'
    },
    shipping: {
        label: 'Đang giao hàng',
        icon: Truck,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10',
        desc: 'Đơn hàng đang trên đường giao tới địa chỉ của bạn.'
    },
    completed: {
        label: 'Đã hoàn thành',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        desc: 'Đơn hàng đã được giao thành công và hoàn tất giao dịch.'
    },
    delivered: {
        label: 'Đã giao hàng',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        desc: 'Đơn hàng đã giao tới bạn.'
    },
    cancelled: {
        label: 'Đã hủy',
        icon: XCircle,
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/10',
        desc: 'Đơn hàng này đã bị hủy bỏ.'
    },
};

const formatVND = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
};

export default function OrderShow({ order }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleCancelOrder = () => {
        Swal.fire({
            title: 'Xác nhận hủy đơn?',
            text: `Bạn có chắc chắn muốn hủy đơn hàng ${order.order_code}? Hành động này không thể hoàn tác.`,
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
                router.post(route('orders.cancel', order.id), {}, {
                    onSuccess: () => {
                        console.log('Order cancelled successfully');
                    }
                });
            }
        });
    };

    const config = statusConfig[order.order_status] || statusConfig.pending;
    const StatusIcon = config.icon;

    // Parse shipping address (assuming format matches name|phone|address)
    const addressParts = order.shipping_address ? order.shipping_address.split('|') : [];
    const customerName = addressParts[0] || 'Chưa cập nhật';
    const customerPhone = addressParts[1] || 'Chưa cập nhật';
    const customerAddress = addressParts[2] || order.shipping_address || 'Chưa cập nhật';

    // Steps timeline calculation
    const steps = ['pending', 'processing', 'shipping', 'completed'];
    const currentStepIndex = steps.indexOf(order.order_status === 'delivered' ? 'completed' : order.order_status);
    const isCancelled = order.order_status === 'cancelled';

    return (
        <AppLayout>
            <Head title={`Đơn hàng ${order.order_code}`} />

            <div className="space-y-8 max-w-6xl mx-auto pb-12">
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        href={route('orders.index')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại lịch sử đơn hàng
                    </Link>

                    <div className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-medium">
                        Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
                    </div>
                </div>

                {/* Main Order Info Card */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className={cn("p-4 rounded-3xl", config.bgColor)}>
                            <StatusIcon className={cn("w-8 h-8", config.color)} />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Đơn hàng {order.order_code}</h1>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    config.bgColor, config.color, "border-current/20"
                                )}>
                                    {config.label}
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm font-medium">
                                {config.desc}
                            </p>
                        </div>
                    </div>

                    <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/50">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Tổng giá trị đơn hàng</p>
                        <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                            {formatVND(order.total_amount)}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Trạng thái: <span className={cn("font-bold", order.payment_status === 'paid' ? 'text-emerald-500' : 'text-amber-500')}>
                                {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Progress Timeline Tracker (Only if not cancelled) */}
                {!isCancelled ? (
                    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none p-8">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            Hành trình đơn hàng
                        </h2>

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 md:px-8">
                            {/* Horizontal Line for Desktop */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block z-0" />
                            {/* Horizontal Active Line for Desktop */}
                            {currentStepIndex >= 0 && (
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-700"
                                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                />
                            )}

                            {steps.map((stepKey, idx) => {
                                const stepConfig = statusConfig[stepKey];
                                const StepIcon = stepConfig.icon;
                                const isCompleted = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;

                                return (
                                    <div key={stepKey} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto text-left md:text-center">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                                            isCompleted
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-110"
                                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400"
                                        )}>
                                            <StepIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className={cn(
                                                "font-black text-sm transition-colors",
                                                isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"
                                            )}>
                                                {stepConfig.label}
                                            </p>
                                            {isCurrent && (
                                                <span className="inline-block mt-0.5 md:mx-auto px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-full">
                                                    Hiện tại
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-rose-50 dark:bg-rose-500/5 rounded-[2.5rem] border border-rose-100 dark:border-rose-500/10 p-8 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-black text-rose-800 dark:text-rose-400 text-lg">Đơn hàng đã hủy</h3>
                            <p className="text-rose-600 dark:text-rose-500/80 text-sm mt-1">Đơn hàng này không còn hoạt động do hành động hủy đơn.</p>
                        </div>
                    </div>
                )}

                {/* Two-Column Detail Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Columns: Product Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-indigo-500" />
                                Danh sách sản phẩm ({order.items.length})
                            </h2>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product?.thumbnail_url ? (item.product.thumbnail_url.startsWith('http')
                                                    ? item.product.thumbnail_url
                                                    : `/storage/${item.product.thumbnail_url}`) : '/placeholder.png'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">
                                                {item.product?.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium italic">
                                                Phân loại: {item.variant?.variant_name || 'Mặc định'}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    {formatVND(item.unit_price)} <span className="text-slate-400 dark:text-slate-600 font-medium ml-1">x {item.quantity}</span>
                                                </p>
                                                <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                                    {formatVND(Number(item.unit_price) * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {order.notes && (
                            <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8">
                                <h3 className="font-black text-slate-900 dark:text-white mb-2">Ghi chú từ khách hàng</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm italic bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                                    "{order.notes}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right 1 Column: Shipping & Payment & Pricing Summary */}
                    <div className="space-y-6">
                        {/* Shipping Info */}
                        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-indigo-500" />
                                Thông tin nhận hàng
                            </h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{customerName}</p>
                                        <p className="text-xs text-slate-400">Người nhận</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{customerPhone}</p>
                                        <p className="text-xs text-slate-400">Số điện thoại</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white leading-relaxed">{customerAddress}</p>
                                        <p className="text-xs text-slate-400">Địa chỉ giao hàng</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Billing */}
                        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-indigo-500" />
                                Chi tiết thanh toán
                            </h2>

                            <div className="space-y-3 text-sm pb-4 border-b border-slate-100 dark:border-slate-800/50">
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Tạm tính</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        {formatVND(Number(order.total_amount) + Number(order.discount_amount))}
                                    </span>
                                </div>

                                {Number(order.discount_amount) > 0 && (
                                    <div className="flex justify-between text-emerald-500">
                                        <span className="flex items-center gap-1">
                                            <Tag className="w-3.5 h-3.5" />
                                            Giảm giá {order.coupon ? `(${order.coupon.code})` : ''}
                                        </span>
                                        <span className="font-bold">
                                            -{formatVND(order.discount_amount)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">Miễn phí</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <span className="font-black text-slate-900 dark:text-white">Tổng thanh toán</span>
                                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                                    {formatVND(order.total_amount)}
                                </span>
                            </div>

                            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800/20 flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">Phương thức thanh toán</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{order.payment_method?.name || 'Mặc định'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Cancellation (Only if pending) */}
                        {order.order_status === 'pending' && (
                            <button
                                onClick={handleCancelOrder}
                                className="w-full py-4 rounded-3xl font-black text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 hover:border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 dark:hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-rose-100 dark:shadow-none"
                            >
                                <Trash2 className="w-4 h-4" />
                                Hủy đơn hàng này
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
