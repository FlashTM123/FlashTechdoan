import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }: { product: any }) {
    const cheapestVariant = product.variants?.[0];
    const discount = cheapestVariant?.old_price > cheapestVariant?.price 
        ? Math.round(((cheapestVariant.old_price - cheapestVariant.price) / cheapestVariant.old_price) * 100) 
        : 0;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative h-full"
        >
            <Link href={`/product/${product.id}`} className="block h-full">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col h-full overflow-hidden">
                    {/* Ảnh sản phẩm */}
                    <div className="aspect-[4/3] bg-slate-50/50 dark:bg-slate-800/30 relative overflow-hidden">
                        <img
                            src={product.thumbnail_url ? (product.thumbnail_url.startsWith('http') ? product.thumbnail_url : `/storage/${product.thumbnail_url}`) : 'https://via.placeholder.com/400'}
                            className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
                            alt={product.name}
                        />
                        
                        {/* Tags */}
                        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                            {discount > 0 ? (
                                <div className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg shadow-red-500/20 uppercase tracking-widest">
                                    -{discount}%
                                </div>
                            ) : null}
                            {product.is_featured ? (
                                <div className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg shadow-amber-400/20 uppercase tracking-widest flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-slate-900" />
                                    Featured
                                </div>
                            ) : null}
                        </div>

                        {/* Nút Xem nhanh (Overlay) */}
                        <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                Xem chi tiết <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Thông tin */}
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                {product.brand?.name || "FlashTech"}
                            </span>
                            <div className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                                {product.category?.name || "Laptop"}
                            </span>
                        </div>

                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg md:text-xl mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {product.name}
                        </h3>

                        <div className="mt-auto pt-4 flex items-end justify-between">
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                        .format(Number(cheapestVariant?.price) || 0)}
                                </p>
                                {discount > 0 && (
                                    <p className="text-sm text-slate-400 dark:text-slate-500 line-through font-medium">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                            .format(Number(cheapestVariant?.old_price))}
                                    </p>
                                )}
                            </div>
                            
                            <button className="bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 p-3.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-300 active:scale-90 shadow-sm">
                                <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
