import { Link } from "@inertiajs/react";

export default function ProductCard({ product }: { product: any }) {
    return (
        <Link href={`/product/${product.id}`} className="group block h-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
                {/* Ảnh sản phẩm */}
                <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative">
                    <img
                        src={product.thumbnail_url ? (product.thumbnail_url.startsWith('http') ? product.thumbnail_url : `/storage/${product.thumbnail_url}`) : 'https://via.placeholder.com/400'}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                        Mới
                    </div>
                </div>

                {/* Thông tin */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                    <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-indigo-600 font-black text-xl">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                    .format(Number(product.variants?.[0]?.price) || 0)}
                            </p>
                            {/* Hiện giá gốc nếu có giảm giá */}
                            {product.variants?.[0]?.old_price > product.variants?.[0]?.price && (
                                <p className="text-slate-400 text-sm line-through decoration-slate-300">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                        .format(Number(product.variants?.[0]?.old_price))}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
