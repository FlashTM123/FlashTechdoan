import React from 'react';
import { Link } from '@inertiajs/react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice, getDiscountPercentage, CompareProductData } from '@/utils/compareUtils';

interface CompareTableHeaderProps {
    products: CompareProductData[];
    onRemove: (variantId: number) => void;
}

export default function CompareTableHeader({ products, onRemove }: CompareTableHeaderProps) {
    return (
        <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                {/* Row Label Column */}
                <th className="px-6 py-4 text-left sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 w-32 min-w-max">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                        Thông số
                    </span>
                </th>

                {/* Product Columns */}
                {products.map((product) => {
                    const variant = product.variants?.[0];
                    const discount = variant?.old_price > variant?.price
                        ? getDiscountPercentage(variant.price, variant.old_price)
                        : 0;

                    return (
                        <th key={product.id} className="px-6 py-6 text-center bg-white dark:bg-slate-900/20 min-w-[280px]">
                            <div className="space-y-4">
                                {/* Product Image */}
                                <div className="h-32 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={product.thumbnail_url}
                                        alt={product.name}
                                        className="max-h-full max-w-full object-contain drop-shadow-md"
                                    />
                                </div>

                                {/* Product Name */}
                                <div className="space-y-1">
                                    <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white line-clamp-2 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors leading-snug text-left">
                                        <Link href={`/product/${product.id}`}>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    {variant?.variant_name && (
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">
                                            {variant.variant_name}
                                        </p>
                                    )}
                                </div>

                                {/* Price Info */}
                                <div className="text-left space-y-1">
                                    {variant && (
                                        <>
                                            <div className="text-lg font-black text-indigo-650 dark:text-indigo-400 font-display">
                                                {formatPrice(variant.price)}
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs line-through text-slate-400 dark:text-slate-550 font-medium">
                                                        {formatPrice(variant.old_price)}
                                                    </span>
                                                    <span className="text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-550/10 border border-rose-100 dark:border-rose-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                                                        -{discount}%
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Stock Status */}
                                {variant && (
                                    <div className="text-left text-[10px] font-black uppercase tracking-wider">
                                        {variant.stock > 0 ? (
                                            <span className="text-emerald-600 dark:text-emerald-450">✓ Còn hàng</span>
                                        ) : (
                                            <span className="text-rose-500 dark:text-rose-450">✗ Hết hàng</span>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => onRemove(variant.id)}
                                        className="flex-1 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-550/20 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 text-xs font-bold active:scale-95 shadow-sm"
                                        title="Xóa khỏi danh sách so sánh"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Xóa</span>
                                    </button>
                                    {variant.stock > 0 ? (
                                        <Link
                                            href="/checkout"
                                            className="flex-1 px-3 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider active:scale-95 shadow-md shadow-indigo-500/10"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            <span>Mua</span>
                                        </Link>
                                    ) : (
                                        <div
                                            className="flex-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold cursor-not-allowed border border-slate-200/50 dark:border-slate-850"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5 opacity-50" />
                                            <span>Hết hàng</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}
