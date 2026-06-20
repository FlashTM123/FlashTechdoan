import { Link, usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import CompareButton from "@/Components/CompareButton";
import { useCart } from "@/Context/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: any }) {
    const { auth } = usePage().props as any;
    const { addToCart } = useCart();
    
    const cheapestVariant = product.variants?.[0];
    const discount = cheapestVariant?.old_price > cheapestVariant?.price
        ? Math.round(((cheapestVariant.old_price - cheapestVariant.price) / cheapestVariant.old_price) * 100)
        : 0;

    const handleQuickAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!cheapestVariant) {
            toast.error("Sản phẩm tạm thời hết hàng.");
            return;
        }

        if (!auth.user) {
            toast.error("Vui lòng đăng nhập", {
                description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
                action: {
                    label: "Đăng nhập ngay",
                    onClick: () => router.visit(route('login'))
                }
            });
            return;
        }

        const imageUrl = product.thumbnail_url
            ? (product.thumbnail_url.startsWith('http') ? product.thumbnail_url : `/storage/${product.thumbnail_url}`)
            : 'https://via.placeholder.com/400';

        addToCart({
            name: product.name,
            variant_id: cheapestVariant.id,
            variant_name: cheapestVariant.variant_name,
            price: cheapestVariant.price,
            image: imageUrl,
            quantity: 1
        });

        toast.success("Đã thêm vào giỏ hàng", {
            description: `${product.name} (${cheapestVariant.variant_name}) đã được thêm thành công.`,
            action: {
                label: "Xem giỏ hàng",
                onClick: () => router.visit('/cart')
            }
        });
    };

    const imageUrl = product.thumbnail_url
        ? (product.thumbnail_url.startsWith('http') ? product.thumbnail_url : `/storage/${product.thumbnail_url}`)
        : 'https://via.placeholder.com/400';

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
            className="group relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden"
        >
            {/* Glowing neon background border effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem] blur-xl" />
            
            {/* Outer wrapper is a div, interior clickable area uses Link */}
            <Link href={`/product/${product.id}`} className="flex flex-col flex-grow">
                {/* Product Image Container */}
                <div className="aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100/30 dark:from-slate-800/50 dark:to-slate-900/30 relative overflow-hidden flex items-center justify-center p-6 sm:p-8">
                    <img
                        src={imageUrl}
                        className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] drop-shadow-lg"
                        alt={product.name}
                    />

                    {/* Tag overlays */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
                        {discount > 0 && (
                            <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-rose-500/20 uppercase tracking-wider">
                                -{discount}%
                            </div>
                        )}
                        {product.is_featured ? (
                            <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-amber-400/20 uppercase tracking-wider flex items-center gap-1">
                                <Star className="w-3 h-3 fill-slate-950" />
                                Nổi bật
                            </div>
                        ) : null}
                    </div>

                    {/* Quick view details overlay */}
                    <div className="absolute inset-0 bg-indigo-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-white">
                            Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>

                {/* Info Text Area */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow relative z-20">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {product.brand?.name || "FlashTech"}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            {product.category?.name || "Laptop"}
                        </span>
                    </div>

                    <h3 className="font-bold text-slate-850 dark:text-slate-100 text-base md:text-lg mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating summary */}
                    <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-2.5 h-2.5",
                                        (product.average_rating || 0) >= star ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                            ({product.reviews_count || 0})
                        </span>
                    </div>
                </div>
            </Link>

            {/* Bottom Actions section outside Link to prevent nested button click issues */}
            <div className="mt-auto px-5 sm:p-6 pt-0 pb-5 flex items-end justify-between gap-2 relative z-30">
                <div className="space-y-1">
                    <p className="text-xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                            .format(Number(cheapestVariant?.price) || 0)}
                    </p>
                    {discount > 0 && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                .format(Number(cheapestVariant?.old_price))}
                        </p>
                    )}
                </div>

                <div className="flex gap-1.5">
                    <CompareButton variantId={cheapestVariant?.id} size="sm" />
                    {cheapestVariant?.stock > 0 ? (
                        <button
                            onClick={handleQuickAddToCart}
                            title="Thêm nhanh vào giỏ"
                            className="bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-600 dark:hover:bg-indigo-600 p-2.5 sm:p-3 rounded-xl text-slate-650 dark:text-slate-350 hover:text-white dark:hover:text-white transition-all duration-200 active:scale-90 shadow-sm border border-slate-100 dark:border-slate-750"
                        >
                            <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        </button>
                    ) : (
                        <div
                            title="Hết hàng"
                            className="bg-slate-100 dark:bg-slate-950 p-2.5 sm:p-3 rounded-xl text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-900"
                        >
                            <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5 opacity-50" strokeWidth={2.5} />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
