import React from 'react';
import { Link } from '@inertiajs/react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice, getDiscountPercentage, CompareProductData } from '@/utils/compareUtils';

interface CompareTableHeaderProps {
    products: CompareProductData[];
    onRemove: (productId: number) => void;
}

export default function CompareTableHeader({ products, onRemove }: CompareTableHeaderProps) {
    return (
        <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
                {/* Row Label Column */}
                <th className="px-6 py-4 text-left sticky left-0 bg-slate-900 z-10 w-32 min-w-max">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Thông số
                    </span>
                </th>

                {/* Product Columns */}
                {products.map((product) => (
                    <th key={product.id} className="px-6 py-4 text-center bg-slate-800/50 min-w-80">
                        <div className="space-y-4">
                            {/* Product Image */}
                            <div className="mb-4">
                                <img
                                    src={product.thumbnail_url}
                                    alt={product.name}
                                    className="h-32 object-cover rounded-lg mx-auto w-full"
                                />
                            </div>

                            {/* Product Name */}
                            <div>
                                <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-blue-400 transition">
                                    <Link href={route('product.show', product.id)}>
                                        {product.name}
                                    </Link>
                                </h3>
                            </div>

                            {/* Price Info */}
                            <div className="space-y-1">
                                {product.variants.length > 0 && (
                                    <>
                                        <div className="text-lg font-bold text-blue-400">
                                            {formatPrice(product.variants[0].price)}
                                        </div>
                                        {product.variants[0].old_price > product.variants[0].price && (
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-xs line-through text-slate-500">
                                                    {formatPrice(product.variants[0].old_price)}
                                                </span>
                                                <span className="text-xs font-semibold text-red-500 bg-red-500/20 px-2 py-1 rounded">
                                                    -
                                                    {getDiscountPercentage(
                                                        product.variants[0].price,
                                                        product.variants[0].old_price
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stock Status */}
                            {product.variants.length > 0 && (
                                <div className="text-xs font-medium">
                                    {product.variants[0].stock > 0 ? (
                                        <span className="text-green-400">✓ Còn hàng</span>
                                    ) : (
                                        <span className="text-red-400">✗ Hết hàng</span>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => onRemove(product.id)}
                                    className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                                    title="Xóa khỏi danh sách so sánh"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Xóa</span>
                                </button>
                                <Link
                                    href={route('checkout.index')}
                                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span className="hidden sm:inline">Mua ngay</span>
                                </Link>
                            </div>
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
}
