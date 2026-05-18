import React, { useState, useEffect } from 'react';
import { useCompare } from '@/hooks/useCompare';
import { AppLayout } from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import {
    CompareProductData,
    highlightDifferences,
    formatSpecName,
    formatPrice,
    getDiscountPercentage,
    getSpecNames,
} from '@/utils/compareUtils';
import CompareTableHeader from '@/Components/CompareTable/CompareTableHeader';
import CompareTableBody from '@/Components/CompareTable/CompareTableBody';

export default function ComparePage() {
    const { compareList, removeFromCompare } = useCompare();
    const [products, setProducts] = useState<CompareProductData[]>([]);
    const [loading, setLoading] = useState(false);
    const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
    const [differenceSpecs, setDifferenceSpecs] = useState<Set<string>>(new Set());

    // Fetch compare data
    useEffect(() => {
        if (compareList.length === 0) {
            setProducts([]);
            return;
        }

        const fetchCompareData = async () => {
            setLoading(true);
            try {
                const response = await axios.post('/api/products/compare', {
                    product_ids: compareList,
                });

                if (response.data.status === 'success') {
                    setProducts(response.data.data);
                    const differences = highlightDifferences(response.data.data);
                    setDifferenceSpecs(differences);
                }
            } catch (error: any) {
                toast.error(
                    error.response?.data?.message || 'Lỗi khi tải dữ liệu so sánh'
                );
                console.error('Error fetching compare data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompareData();
    }, [compareList]);

    const handleRemove = (productId: number) => {
        removeFromCompare(productId);
        toast.success('Đã xóa sản phẩm khỏi danh sách so sánh');
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-300">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (compareList.length === 0 || products.length === 0) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <h1 className="text-4xl font-bold text-white mb-4">So sánh sản phẩm</h1>
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
                            <p className="text-slate-400 text-lg mb-6">
                                Bạn chưa chọn sản phẩm nào để so sánh
                            </p>
                            <Link
                                href={route('products.index')}
                                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                            >
                                Chọn sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-900">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">So sánh sản phẩm</h1>
                        <p className="text-slate-400">
                            {products.length} sản phẩm đang được so sánh
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="mb-6 flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showOnlyDifferences}
                                onChange={(e) => setShowOnlyDifferences(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-600 text-blue-600 cursor-pointer"
                            />
                            <span className="text-slate-300">
                                Chỉ hiển thị điểm khác biệt
                            </span>
                        </label>

                        <Link
                            href={route('products.index')}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                        >
                            + Thêm sản phẩm khác
                        </Link>
                    </div>

                    {/* Compare Table */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <CompareTableHeader products={products} onRemove={handleRemove} />
                                <CompareTableBody
                                    products={products}
                                    showOnlyDifferences={showOnlyDifferences}
                                    differenceSpecs={differenceSpecs}
                                />
                            </table>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <p className="text-slate-400 text-sm">
                            💡 Mẹo: Bạn có thể chọn "Chỉ hiển thị điểm khác biệt" để xem các thông số
                            mà sản phẩm khác nhau.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
