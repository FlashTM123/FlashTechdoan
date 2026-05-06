import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductDetail({ product }: { product: any }) {
    // Khởi tạo biến thể đang chọn
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);

    const getImageUrl = (path: string) => {
        if (!path) return 'https://via.placeholder.com/400';
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    return (
        <AppLayout>
            <Head title={`${product.name} - FlashTech`} />

            {/* Breadcrumb */}
            <nav className="flex mb-8 text-sm font-medium text-slate-500">
                <Link href="/" className="hover:text-indigo-600 transition">Trang chủ</Link>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-900 line-clamp-1">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                {/* Bên trái: Gallery Ảnh */}
                <div className="sticky top-24">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
                        <img
                            src={getImageUrl(product.thumbnail_url)}
                            className="max-h-[450px] w-auto object-contain hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Bên phải: Thông tin & Lựa chọn */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight font-display tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-end gap-4">
                            <p className="text-4xl font-black text-indigo-600 font-display">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                    .format(Number(selectedVariant?.price) || 0)}
                            </p>
                            {/* Giá cũ gạch ngang */}
                            {selectedVariant?.old_price > selectedVariant?.price && (
                                <p className="text-xl text-slate-400 line-through mb-1 decoration-slate-300">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                        .format(Number(selectedVariant.old_price))}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* KHU VỰC CHỌN BIẾN THỂ (Sửa lại để hiện kể cả khi có 1 cái) */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Cấu hình & Màu sắc</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.variants.map((variant: any) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group ${selectedVariant?.id === variant.id
                                                ? 'border-indigo-600 bg-indigo-50/30'
                                                : 'border-slate-100 hover:border-slate-300 bg-white'
                                            }`}
                                    >
                                        <div className={`font-bold text-sm ${selectedVariant?.id === variant.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                                            {variant.variant_name || variant.color}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            SKU: {variant.sku}
                                        </div>
                                        {selectedVariant?.id === variant.id && (
                                            <div className="absolute top-0 right-0 p-1">
                                                <div className="bg-indigo-600 text-white p-0.5 rounded-bl-lg">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]">
                            Thêm vào giỏ hàng
                        </button>
                        <button className="w-16 h-16 flex items-center justify-center border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors text-slate-400 hover:text-red-500">
                            ❤
                        </button>
                    </div>

                    {/* MÔ TẢ CHI TIẾT (Fix hiển thị) */}
                    <div className="pt-10 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Mô tả sản phẩm</h4>
                        <div
                            className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.description || "Chưa có nội dung mô tả." }}
                        />
                    </div>

                    {/* THÔNG SỐ KỸ THUẬT (Đã chuẩn hóa Database) */}
                    <div className="pt-10 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Thông số kỹ thuật</h4>
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-500">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {selectedVariant?.details && selectedVariant.details.length > 0 ? (
                                        selectedVariant.details.map((detail: any, index: number) => (
                                            <tr key={detail.id} className="hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 pl-6 font-semibold text-slate-500 dark:text-slate-400 w-1/3">
                                                    {detail.attribute_name}
                                                </td>
                                                <td className="py-4 pr-6 text-slate-900 dark:text-white font-bold">
                                                    {detail.attribute_value}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        /* Fallback khi không có thông số trong bảng details */
                                        [
                                            { label: "CPU", value: "Đang cập nhật" },
                                            { label: "RAM", value: "Đang cập nhật" },
                                            { label: "Ổ cứng", value: "Đang cập nhật" },
                                        ].map((spec, index) => (
                                            <tr key={index}>
                                                <td className="py-4 pl-6 font-semibold text-slate-500 dark:text-slate-400 w-1/3">{spec.label}</td>
                                                <td className="py-4 pr-6 text-slate-900 dark:text-white font-bold">{spec.value}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button className="w-full mt-4 py-3 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl transition-all">
                            Xem cấu hình chi tiết ↓
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
