import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart, Heart, ChevronRight, X, Star,
    Shield, RotateCcw, Truck, Headphones, Zap,
    CheckCircle, Package, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCart } from '@/Context/CartContext';
import ReviewSection from '@/Components/Reviews/ReviewSection';
import CompareButton from '@/Components/CompareButton';
import { usePage } from '@inertiajs/react';

export default function ProductDetail({ product }: { product: any }) {
    const { auth } = usePage().props as any;
    const { addToCart } = useCart();

    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showSpecsModal, setShowSpecsModal] = useState(false);
    const [activeImageOverride, setActiveImageOverride] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs');

    const SPECS_PREVIEW_COUNT = 6;

    const getImageUrl = (path: string) => {
        if (!path) return 'https://placehold.co/600x600/1e293b/475569?text=No+Image';
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    const activeImage = useMemo(() => {
        if (activeImageOverride) return getImageUrl(activeImageOverride);
        if (selectedVariant?.images?.length > 0) {
            const primary = selectedVariant.images.find((img: any) => img.is_primary) || selectedVariant.images[0];
            return getImageUrl(primary.image_url);
        }
        const productImages = product.images || [];
        const primary = productImages.find((img: any) => img.is_primary && !img.product_variant_id)
            || productImages.find((img: any) => !img.product_variant_id);
        return primary ? getImageUrl(primary.image_url) : getImageUrl(product.thumbnail_url);
    }, [selectedVariant, product, activeImageOverride]);

    const allThumbnails = (product.images || []).filter((img: any) =>
        !img.product_variant_id || img.product_variant_id === selectedVariant?.id
    );

    const discountPercent = selectedVariant?.old_price > selectedVariant?.price
        ? Math.round(((selectedVariant.old_price - selectedVariant.price) / selectedVariant.old_price) * 100)
        : 0;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        if (!auth?.user) {
            toast.error('Vui lòng đăng nhập', {
                description: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.',
                action: { label: 'Đăng nhập ngay', onClick: () => router.visit(route('login')) }
            });
            return;
        }
        addToCart({
            name: product.name,
            variant_id: selectedVariant.id,
            variant_name: selectedVariant.variant_name,
            price: selectedVariant.price,
            image: activeImage,
            quantity: 1
        });
        toast.success('Đã thêm vào giỏ hàng', {
            description: `${product.name} · ${selectedVariant?.variant_name}`,
            action: { label: 'Xem giỏ hàng', onClick: () => router.visit('/cart') }
        });
    };

    const allSpecs = selectedVariant?.details?.length > 0
        ? selectedVariant.details
        : [
            { attribute_name: 'CPU', attribute_value: 'Intel Core / Apple M-series' },
            { attribute_name: 'RAM', attribute_value: '16GB Unified' },
            { attribute_name: 'Ổ cứng', attribute_value: '512GB SSD PCIe' },
        ];
    const previewSpecs = allSpecs.slice(0, SPECS_PREVIEW_COUNT);
    const hasMoreSpecs = allSpecs.length > SPECS_PREVIEW_COUNT;

    const trustBadges = [
        { icon: Shield, label: 'Bảo hành 12 tháng', sub: 'Chính hãng toàn quốc', color: 'text-indigo-400' },
        { icon: RotateCcw, label: 'Đổi trả 30 ngày', sub: 'Không cần lý do', color: 'text-emerald-400' },
        { icon: Truck, label: 'Giao hàng nhanh', sub: 'Toàn quốc 24-48h', color: 'text-amber-400' },
        { icon: Headphones, label: 'Hỗ trợ 24/7', sub: 'Hotline: 1900.1234', color: 'text-rose-400' },
    ];

    return (
        <AppLayout>
            <Head title={`${product.name} - FlashTech`} />

            {/* ── Breadcrumb ───────────────────────────────────────────── */}
            <nav className="flex items-center gap-1.5 mb-8 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Link href="/" className="hover:text-indigo-500 transition-colors">Trang chủ</Link>
                <ChevronRight className="w-3 h-3 opacity-50" />
                <Link href="/products" className="hover:text-indigo-500 transition-colors">Sản phẩm</Link>
                <ChevronRight className="w-3 h-3 opacity-50" />
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[220px]">{product.name}</span>
            </nav>

            {/* ── Main Grid ─────────────────────────────────────────────── */}
            <div className="grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-10 xl:gap-16 items-start">

                {/* ── LEFT: Gallery ─────────────────────────────────────── */}
                <div className="lg:sticky lg:top-24 space-y-4">

                    {/* Main Image */}
                    <div className="relative aspect-[4/3] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex items-center justify-center group">
                        {/* Discount badge overlay */}
                        {discountPercent > 0 && (
                            <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg shadow-rose-500/30 flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 fill-current" />
                                -{discountPercent}%
                            </div>
                        )}

                        {/* Wishlist floating button */}
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={cn(
                                "absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all shadow-lg active:scale-90",
                                isWishlisted
                                    ? "bg-rose-500 text-white shadow-rose-500/30"
                                    : "bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
                            )}
                        >
                            <Heart className={cn("w-4.5 h-4.5", isWishlisted && "fill-current")} strokeWidth={2.5} />
                        </button>

                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                src={activeImage}
                                alt={product.name}
                                className="max-h-full max-w-[85%] object-contain drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                            />
                        </AnimatePresence>

                        {/* Subtle gradient bg */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-violet-50/20 dark:from-indigo-900/10 dark:to-violet-900/10 pointer-events-none" />
                    </div>

                    {/* Thumbnails */}
                    {allThumbnails.length > 1 && (
                        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                            {allThumbnails.map((img: any) => {
                                const url = getImageUrl(img.image_url);
                                const isActive = activeImage === url;
                                return (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImageOverride(img.image_url)}
                                        className={cn(
                                            "w-16 h-16 flex-shrink-0 rounded-xl border-2 p-1.5 bg-white dark:bg-slate-900 transition-all",
                                            isActive
                                                ? "border-indigo-500 shadow-md shadow-indigo-500/20 scale-105"
                                                : "border-slate-150 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        <img src={url} className="w-full h-full object-contain" alt="thumb" />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Trust badges - desktop only below image */}
                    <div className="hidden lg:grid grid-cols-2 gap-3 pt-2">
                        {trustBadges.map(({ icon: Icon, label, sub, color }) => (
                            <div key={label} className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <Icon className={cn("w-5 h-5 flex-shrink-0", color)} strokeWidth={2} />
                                <div>
                                    <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 leading-tight">{label}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT: Product Info + CTA ──────────────────────────── */}
                <div className="space-y-7">

                    {/* Brand + Rating */}
                    <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                            {product.brand?.name || 'FlashTech'}
                        </span>
                        {(product.reviews_count > 0) && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    {[1,2,3,4,5].map(s => (
                                        <Star key={s} className={cn("w-3.5 h-3.5", s <= Math.round(product.average_rating || 0) ? "text-amber-400 fill-current" : "text-slate-200 dark:text-slate-700")} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                    {Number(product.average_rating || 0).toFixed(1)} ({product.reviews_count} đánh giá)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-2xl md:text-3xl xl:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                        {product.name}
                    </h1>

                    {/* Price Block */}
                    <div className="flex items-end gap-4 p-5 bg-gradient-to-r from-indigo-600/5 via-violet-600/5 to-transparent dark:from-indigo-500/10 dark:via-violet-500/5 rounded-2xl border border-indigo-100/60 dark:border-indigo-500/15">
                        <div className="space-y-1">
                            <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 leading-none tabular-nums">
                                {formatPrice(Number(selectedVariant?.price) || 0)}
                            </p>
                            {discountPercent > 0 && (
                                <p className="text-sm font-medium text-slate-400 line-through tabular-nums">
                                    {formatPrice(Number(selectedVariant.old_price))}
                                </p>
                            )}
                        </div>
                        {discountPercent > 0 && (
                            <div className="mb-1 flex flex-col items-center">
                                <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                                    -Giảm {discountPercent}%
                                </span>
                                <span className="text-[10px] text-slate-400 mt-1 font-medium">
                                    Tiết kiệm {formatPrice(Number(selectedVariant.old_price) - Number(selectedVariant.price))}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Variant Selector */}
                    {product.variants?.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                                Chọn cấu hình & màu sắc
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.variants.map((variant: any) => {
                                    const isSelected = selectedVariant?.id === variant.id;
                                    const isOutOfStock = variant.stock <= 0;
                                    return (
                                        <button
                                            key={variant.id}
                                            disabled={isOutOfStock}
                                            onClick={() => { setActiveImageOverride(null); setSelectedVariant(variant); }}
                                            className={cn(
                                                "relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-2",
                                                isSelected
                                                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 dark:border-indigo-400 ring-4 ring-indigo-500/10"
                                                    : isOutOfStock
                                                        ? "border-slate-100 dark:border-slate-800/50 opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/20"
                                                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-indigo-300 dark:hover:border-slate-600 hover:shadow-md"
                                            )}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-3 right-3">
                                                    <CheckCircle className="w-4 h-4 text-indigo-500 fill-indigo-500 text-white" strokeWidth={2.5} />
                                                </div>
                                            )}
                                            <span className={cn(
                                                "text-xs font-black uppercase tracking-wider leading-tight pr-5",
                                                isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"
                                            )}>
                                                {variant.variant_name}
                                            </span>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                                    {variant.sku}
                                                </span>
                                                {isOutOfStock ? (
                                                    <span className="text-[10px] font-black text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">Hết hàng</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                        <Package className="w-3 h-3" /> Còn {variant.stock}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="space-y-3 pt-1">
                        {selectedVariant?.stock > 0 ? (
                            <button
                                onClick={handleAddToCart}
                                className="w-full relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm tracking-wide hover:scale-[1.01] transition-all duration-200 shadow-xl shadow-indigo-500/25 active:scale-[0.99] flex items-center justify-center gap-2.5 group"
                            >
                                <motion.span
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2.5"
                                >
                                    <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                                    Thêm vào giỏ hàng
                                </motion.span>
                                {/* Shimmer effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </button>
                        ) : (
                            <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 text-center">
                                <p className="text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Tạm hết hàng</p>
                                <p className="text-[10px] font-medium text-slate-400 mt-1">Liên hệ 1900.1234 để đặt trước</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <CompareButton variantId={selectedVariant?.id} size="md" className="flex-1" />
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={cn(
                                    "w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-2xl border-2 transition-all active:scale-90 shadow-sm",
                                    isWishlisted
                                        ? "bg-rose-50 border-rose-300 text-rose-500 dark:bg-rose-500/15 dark:border-rose-500/40 shadow-rose-500/20"
                                        : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-200 hover:text-rose-400 dark:hover:border-slate-600"
                                )}
                            >
                                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Trust badges - mobile only */}
                    <div className="lg:hidden grid grid-cols-2 gap-2.5">
                        {trustBadges.map(({ icon: Icon, label, sub, color }) => (
                            <div key={label} className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                                <Icon className={cn("w-4.5 h-4.5 flex-shrink-0", color)} strokeWidth={2} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 leading-tight">{label}</p>
                                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Tabs: Specs + Description ──────────────────────────────── */}
            <div className="mt-20 mb-4">
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
                    {(['specs', 'description'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                activeTab === tab
                                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {tab === 'specs' ? '📋 Thông số kỹ thuật' : '📝 Mô tả sản phẩm'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Specs Table ────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {activeTab === 'specs' && (
                    <motion.div
                        key="specs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mb-16"
                    >
                        <div className="overflow-hidden rounded-3xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                            <table className="w-full text-sm">
                                <tbody>
                                    {previewSpecs.map((detail: any, idx: number) => (
                                        <tr
                                            key={detail.id ?? idx}
                                            className={cn(
                                                "group transition-colors",
                                                idx % 2 === 0
                                                    ? "bg-transparent"
                                                    : "bg-slate-50/60 dark:bg-slate-900/30",
                                                "hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5"
                                            )}
                                        >
                                            <td className="py-4 pl-7 pr-4 w-2/5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100/60 dark:border-slate-800/50">
                                                {detail.attribute_name}
                                            </td>
                                            <td className="py-4 pr-7 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-100/60 dark:border-slate-800/50 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                                {detail.attribute_value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {hasMoreSpecs && (
                                <>
                                    <div className="h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent -mt-12 pointer-events-none" />
                                    <div className="p-5 flex justify-center border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => setShowSpecsModal(true)}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-indigo-500/20 hover:scale-[1.02]"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                            Xem tất cả {allSpecs.length} thông số
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── Description ─────────────────────────────────────────── */}
                {activeTab === 'description' && (
                    <motion.div
                        key="description"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mb-16"
                    >
                        <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-150 dark:border-slate-800 p-8 md:p-12">
                            <div
                                className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: product.description
                                        || '<p class="text-slate-400 italic">Chưa có mô tả sản phẩm.</p>'
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Full Specs Modal ───────────────────────────────────────── */}
            <AnimatePresence>
                {showSpecsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSpecsModal(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">Thông số kỹ thuật đầy đủ</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                        {product.name} · {selectedVariant?.variant_name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowSpecsModal(false)}
                                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
                                >
                                    <X className="w-4.5 h-4.5" />
                                </button>
                            </div>

                            {/* Scrollable */}
                            <div className="overflow-y-auto flex-grow scrollbar-thin">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {allSpecs.map((detail: any, idx: number) => (
                                            <tr
                                                key={detail.id ?? idx}
                                                className={cn(
                                                    "group transition-colors border-b border-slate-100/60 dark:border-slate-800/50",
                                                    idx % 2 === 0 ? "bg-transparent" : "bg-slate-50/60 dark:bg-slate-800/20",
                                                    "hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5"
                                                )}
                                            >
                                                <td className="py-3.5 pl-7 pr-4 w-2/5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    {detail.attribute_name}
                                                </td>
                                                <td className="py-3.5 pr-7 text-slate-800 dark:text-slate-200 font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                                    {detail.attribute_value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                                <button
                                    onClick={() => setShowSpecsModal(false)}
                                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all"
                                >
                                    Đóng
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Review Section ─────────────────────────────────────────── */}
            <ReviewSection productId={product.id} auth={auth} />
        </AppLayout>
    );
}
