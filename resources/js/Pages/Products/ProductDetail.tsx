import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, CheckCircle2, ChevronRight, X, Info, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCart } from '@/Context/CartContext';
import ReviewSection from '@/Components/Reviews/ReviewSection';
import CompareButton from '@/Components/CompareButton';
import { usePage } from '@inertiajs/react';

export default function ProductDetail({ product }: { product: any }) {
    const { auth } = usePage().props as any;
    const { addToCart } = useCart();

    // Khởi tạo biến thể đang chọn
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showSpecsModal, setShowSpecsModal] = useState(false);

    const SPECS_PREVIEW_COUNT = 5;

    const getImageUrl = (path: string) => {
        if (!path) return 'https://via.placeholder.com/600';
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    // Tính toán ảnh đang hiển thị
    const activeImage = useMemo(() => {
        if (selectedVariant?.images && selectedVariant.images.length > 0) {
            const variantPrimary = selectedVariant.images.find((img: any) => img.is_primary) || selectedVariant.images[0];
            return getImageUrl(variantPrimary.image_url);
        }
        const productImages = product.images || [];
        const productPrimary = productImages.find((img: any) => img.is_primary && !img.product_variant_id) || productImages.find((img: any) => !img.product_variant_id);

        if (productPrimary) {
            return getImageUrl(productPrimary.image_url);
        }
        return getImageUrl(product.thumbnail_url);
    }, [selectedVariant, product]);

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addToCart({
            name: product.name,
            variant_id: selectedVariant.id,
            variant_name: selectedVariant.variant_name,
            price: selectedVariant.price,
            image: activeImage,
            quantity: 1
        });

        toast.success("Đã thêm vào giỏ hàng", {
            description: `${product.name} - ${selectedVariant?.variant_name} đã được thêm vào giỏ hàng của bạn.`,
            action: {
                label: "Xem giỏ hàng",
                onClick: () => router.visit('/cart')
            }
        });
    };

    return (
        <AppLayout>
            <Head title={`${product.name} - FlashTech`} />

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-10 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                <Link href="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/products" className="hover:text-indigo-600 transition-colors">Sản phẩm</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
                {/* BÊN TRÁI: Gallery Ảnh (Sticky) */}
                <div className="lg:sticky lg:top-32 space-y-6">
                    <div className="relative aspect-square bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden group">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                src={activeImage}
                                className="max-h-full w-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                            />
                        </AnimatePresence>

                        {/* Phóng to overlay */}
                        <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    {/* Thumbnail list (nếu có nhiều ảnh) */}
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {product.images?.map((img: any, idx: number) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedVariant(product.variants.find((v:any) => v.id === img.product_variant_id) || selectedVariant)}
                                className={cn(
                                    "w-20 h-20 rounded-2xl border-2 transition-all p-2 flex-shrink-0 bg-white dark:bg-slate-900",
                                    activeImage === getImageUrl(img.image_url) ? "border-indigo-600 shadow-lg shadow-indigo-500/20" : "border-slate-100 dark:border-slate-800"
                                )}
                            >
                                <img src={getImageUrl(img.image_url)} className="w-full h-full object-contain" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* BÊN PHẢI: Thông tin & Lựa chọn */}
                <div className="space-y-12 pb-20">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                {product.brand?.name}
                            </span>
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                    {product.average_rating || 0} ({product.reviews_count || 0} đánh giá)
                                </span>
                            </div>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] font-display tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-6">
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-display">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                        .format(Number(selectedVariant?.price) || 0)}
                                </p>
                                {selectedVariant?.old_price > selectedVariant?.price && (
                                    <p className="text-lg text-slate-400 line-through decoration-slate-300">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                            .format(Number(selectedVariant.old_price))}
                                    </p>
                                )}
                            </div>
                            {selectedVariant?.old_price > selectedVariant?.price && (
                                <div className="bg-red-500 text-white px-3 py-1.5 rounded-xl font-black text-sm animate-pulse">
                                    TIẾT KIỆM {Math.round(((selectedVariant.old_price - selectedVariant.price) / selectedVariant.old_price) * 100)}%
                                </div>
                            )}
                        </div>
                    </section>

                    {/* LỰA CHỌN BIẾN THỂ */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Cấu hình & Màu sắc</h4>
                                <span className="text-[10px] font-bold text-indigo-600 underline cursor-pointer">Hướng dẫn chọn cấu hình</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.variants.map((variant: any) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={cn(
                                            "p-5 rounded-3xl border-2 text-left transition-all duration-300 relative group",
                                            selectedVariant?.id === variant.id
                                                ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-xl shadow-indigo-500/10"
                                                : "border-slate-100 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={cn(
                                                "font-black text-sm uppercase tracking-wider",
                                                selectedVariant?.id === variant.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
                                            )}>
                                                {variant.variant_name}
                                            </div>
                                            {selectedVariant?.id === variant.id && (
                                                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                                            <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]">{variant.sku}</span>
                                            {variant.stock > 0 ? (
                                                <span className="text-emerald-500">Còn {variant.stock} sản phẩm</span>
                                            ) : (
                                                <span className="text-red-500 font-bold">Hết hàng</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* HÀNH ĐỘNG */}
                    <div className="space-y-4">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[2rem] font-black text-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-2xl shadow-slate-300 dark:shadow-none active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" strokeWidth={2.5} />
                            Thêm vào giỏ hàng
                        </button>
                        <div className="flex gap-4">
                            <CompareButton variantId={selectedVariant?.id} size="md" className="flex-1" />
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={cn(
                                    "w-20 h-20 flex items-center justify-center border-2 rounded-[2rem] transition-all active:scale-90",
                                    isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50"
                                )}
                            >
                                <Heart className={cn("w-7 h-7", isWishlisted && "fill-current")} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* CHÍNH SÁCH NHANH */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: CheckCircle2, text: "Bảo hành 12 tháng chính hãng", color: "text-blue-500" },
                            { icon: Info, text: "Đổi trả trong 30 ngày", color: "text-emerald-500" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <item.icon className={cn("w-5 h-5", item.color)} strokeWidth={3} />
                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-tight">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* MÔ TẢ CHI TIẾT */}
                    <div className="pt-16 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                            <Info className="w-4 h-4" /> Mô tả sản phẩm
                        </h4>
                        <div
                            className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium"
                            dangerouslySetInnerHTML={{ __html: product.description || "Chưa có nội dung mô tả." }}
                        />
                    </div>

                    {/* THÔNG SỐ KỸ THUẬT */}
                    <div className="pt-16 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-10">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Share2 className="w-4 h-4" /> Thông số kỹ thuật
                            </h4>
                        </div>

                        {(() => {
                            const allSpecs = selectedVariant?.details?.length > 0
                                ? selectedVariant.details
                                : [
                                    { attribute_name: "CPU", attribute_value: "Apple M3 Chip" },
                                    { attribute_name: "RAM", attribute_value: "16GB Unified Memory" },
                                    { attribute_name: "Storage", attribute_value: "512GB SSD" },
                                ];
                            const previewSpecs = allSpecs.slice(0, SPECS_PREVIEW_COUNT);
                            const hasMore = allSpecs.length > SPECS_PREVIEW_COUNT;

                            return (
                                <>
                                    {/* Bảng preview */}
                                    <div className="relative bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">
                                        <table className="w-full text-sm">
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {previewSpecs.map((detail: any, idx: number) => (
                                                    <tr key={detail.id ?? idx} className="hover:bg-white dark:hover:bg-slate-800 transition-colors group">
                                                        <td className="py-5 pl-8 font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest w-1/3">
                                                            {detail.attribute_name}
                                                        </td>
                                                        <td className="py-5 pr-8 text-slate-900 dark:text-white font-bold group-hover:text-indigo-600 transition-colors">
                                                            {detail.attribute_value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Gradient fade ứ ở dưới */}
                                        {hasMore && (
                                            <div className="h-14 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent -mt-14 relative pointer-events-none" />
                                        )}
                                    </div>

                                    {/* Nút mở popup */}
                                    {hasMore && (
                                        <motion.button
                                            onClick={() => setShowSpecsModal(true)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Xem tất cả {allSpecs.length} thông số
                                        </motion.button>
                                    )}

                                    {/* POPUP MODAL */}
                                    <AnimatePresence>
                                        {showSpecsModal && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => setShowSpecsModal(false)}
                                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.85, y: 40 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.85, y: 40 }}
                                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
                                                >
                                                    {/* Modal Header */}
                                                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                                                        <div>
                                                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                                                Thông số kỹ thuật
                                                            </h3>
                                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                                {product.name} • {selectedVariant?.variant_name}
                                                            </p>
                                                        </div>
                                                        <motion.button
                                                            onClick={() => setShowSpecsModal(false)}
                                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </motion.button>
                                                    </div>

                                                    {/* Modal Body - Scrollable */}
                                                    <div className="overflow-y-auto flex-1">
                                                        <table className="w-full text-sm">
                                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                                {allSpecs.map((detail: any, idx: number) => (
                                                                    <motion.tr
                                                                        key={detail.id ?? idx}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: idx * 0.02, duration: 0.25 }}
                                                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                                                    >
                                                                        <td className="py-5 pl-8 font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest w-2/5">
                                                                            {detail.attribute_name}
                                                                        </td>
                                                                        <td className="py-5 pr-8 text-slate-900 dark:text-white font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                                            {detail.attribute_value}
                                                                        </td>
                                                                    </motion.tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Modal Footer */}
                                                    <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                                                        <button
                                                            onClick={() => setShowSpecsModal(false)}
                                                            className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all active:scale-95"
                                                        >
                                                            Đóng
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            );
                        })()}
                    </div>
                    </div>
                </div>
          

            {/* PHẦN ĐÁNH GIÁ VÀ BÌNH LUẬN */}
            <ReviewSection productId={product.id} auth={auth} />
        </AppLayout>
    );
}
