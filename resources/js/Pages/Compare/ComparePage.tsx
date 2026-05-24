import React, { useState, useEffect } from 'react';
import { useCompare } from '@/hooks/useCompare';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
    CompareProductData,
    highlightDifferences,
    formatPrice,
} from '@/utils/compareUtils';
import CompareTableHeader from '@/Components/CompareTable/CompareTableHeader';
import CompareTableBody from '@/Components/CompareTable/CompareTableBody';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CHART_COLORS = ['#6366f1', '#06b6d4', '#a855f7', '#10b981', '#f59e0b'];

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
                    variant_ids: compareList,
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

    const handleRemove = (variantId: number) => {
        removeFromCompare(variantId);
        toast.success('Đã xóa sản phẩm khỏi danh sách so sánh');
    };

    // --- CHUẨN BỊ DỮ LIỆU ĐỒ THỊ RECHARTS (VISUAL BENCHMARKING) ---
    
    // 1. Radar Chart Cấu hình
    const radarData = React.useMemo(() => {
        if (products.length === 0) return [];
        
        const getVal = (details: Record<string, string>, keys: string[], unit: string, def: number): number => {
            const detailKey = Object.keys(details || {}).find(k => 
                keys.some(sk => k.toLowerCase().includes(sk.toLowerCase()))
            );
            if (!detailKey) return def;
            const valStr = details[detailKey];
            if (!valStr) return def;
            const match = valStr.match(/(\d+(\.\d+)?)/);
            if (!match) return def;
            let num = parseFloat(match[1]);
            if (valStr.toLowerCase().includes('tb') && unit === 'gb') {
                num = num * 1024;
            }
            return num;
        };

        const specs = [
            { key: 'ram', label: 'Dung lượng RAM', keys: ['ram', 'bộ nhớ trong', 'memory'], unit: 'gb', def: 16 },
            { key: 'storage', label: 'Ổ cứng SSD', keys: ['ssd', 'ổ cứng', 'storage', 'dung lượng'], unit: 'gb', def: 512 },
            { key: 'battery', label: 'Dung lượng Pin', keys: ['pin', 'battery'], unit: 'wh', def: 60 },
            { key: 'weight', label: 'Trọng lượng nhẹ', keys: ['trọng lượng', 'cân nặng', 'weight'], unit: 'kg', def: 1.6 },
            { key: 'price', label: 'Tiết kiệm chi phí', keys: [], unit: '', def: 0, isPrice: true }
        ];

        return specs.map(spec => {
            const row: Record<string, any> = { subject: spec.label };
            
            products.forEach((p) => {
                const variant = p.variants?.[0];
                const details = variant?.details || {};
                const productName = p.name.split(' ').slice(0, 3).join(' ') + (variant ? ` (${variant.variant_name})` : '');
                
                let rawValue = 0;
                if (spec.isPrice) {
                    rawValue = variant?.price || p.price || 20000000;
                } else {
                    rawValue = getVal(details, spec.keys, spec.unit, spec.def);
                }

                // Chuẩn hóa điểm số (Score 20 - 100)
                let score = 50;
                if (spec.key === 'ram') {
                    score = Math.min(100, Math.max(20, (rawValue / 32) * 100));
                } else if (spec.key === 'storage') {
                    score = Math.min(100, Math.max(20, (rawValue / 1024) * 100));
                } else if (spec.key === 'battery') {
                    score = Math.min(100, Math.max(20, (rawValue / 99) * 100));
                } else if (spec.key === 'weight') {
                    const weightVal = rawValue > 0 ? rawValue : 1.6;
                    score = Math.min(100, Math.max(20, ((3 - weightVal) / 2) * 100));
                } else if (spec.isPrice) {
                    score = Math.min(100, Math.max(20, ((45000000 - rawValue) / 35000000) * 100));
                }
                
                row[productName] = Math.round(score);
            });
            
            return row;
        });
    }, [products]);

    // 2. Bar Chart Giá bán
    const barData = React.useMemo(() => {
        return products.map(p => {
            const variant = p.variants?.[0];
            return {
                name: p.name.split(' ').slice(0, 2).join(' ') + (variant ? ` (${variant.variant_name})` : ''),
                'Giá bán (đ)': variant?.price || p.price || 0,
            };
        });
    }, [products]);

    // Lấy tên nhãn của các sản phẩm so sánh
    const productLabels = React.useMemo(() => {
        return products.map(p => {
            const variant = p.variants?.[0];
            return p.name.split(' ').slice(0, 3).join(' ') + (variant ? ` (${variant.variant_name})` : '');
        });
    }, [products]);

    if (loading) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-500">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 font-bold">Đang tải dữ liệu so sánh...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (compareList.length === 0 || products.length === 0) {
        return (
            <AppLayout>
                <Head title="So sánh sản phẩm - FlashTech" />
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 transition-colors duration-500">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 font-display tracking-tight">So sánh sản phẩm</h1>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[3rem] p-12 shadow-2xl">
                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 font-medium">
                                Bạn chưa chọn sản phẩm nào để tiến hành so sánh.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition shadow-lg shadow-indigo-500/20 text-sm uppercase tracking-widest active:scale-95"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại chọn sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="So sánh cấu hình - FlashTech" />
            
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    
                    {/* Header */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                                So sánh sản phẩm <span className="text-indigo-600">.</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3">
                                Đang so sánh {products.length} sản phẩm công nghệ cao
                            </p>
                        </div>
                        
                        <Link
                            href="/products"
                            className="px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all text-xs uppercase tracking-widest active:scale-95"
                        >
                            + Thêm sản phẩm
                        </Link>
                    </div>

                    {/* --- BIỂU ĐỒ BĂNG THÔNG CẤU HÌNH (VISUAL BENCHMARKING) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        
                        {/* 1. Radar Chart so sánh cấu hình */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 font-display tracking-tight flex items-center gap-2">
                                📊 Đánh giá cấu hình tổng quan (Score)
                            </h3>
                            <div className="h-[320px] w-full flex items-center justify-center text-xs">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                        {productLabels.map((label, idx) => (
                                            <Radar
                                                key={label}
                                                name={label}
                                                dataKey={label}
                                                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                                                fill={CHART_COLORS[idx % CHART_COLORS.length]}
                                                fillOpacity={0.25}
                                            />
                                        ))}
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#1e293b', 
                                                borderRadius: '1rem', 
                                                border: 'none', 
                                                color: '#fff',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }} 
                                        />
                                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 2. Bar Chart so sánh giá bán */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 font-display tracking-tight flex items-center gap-2">
                                🏷️ So sánh giá bán thực tế
                            </h3>
                            <div className="h-[320px] w-full flex items-center justify-center text-xs">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
                                        <YAxis tickFormatter={(val) => `${val / 1000000}M`} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                        <Tooltip
                                            formatter={(value: any) => [`${value.toLocaleString()}đ`, 'Giá bán']}
                                            contentStyle={{ 
                                                backgroundColor: '#1e293b', 
                                                borderRadius: '1rem', 
                                                border: 'none', 
                                                color: '#fff',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }} 
                                        />
                                        <Bar 
                                            dataKey="Giá bán (đ)" 
                                            fill="#6366f1" 
                                            radius={[10, 10, 0, 0]}
                                            maxBarSize={60}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mb-6 flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={showOnlyDifferences}
                                onChange={(e) => setShowOnlyDifferences(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-slate-600 dark:text-slate-300 text-sm font-bold group-hover:text-indigo-600 transition-colors">
                                Chỉ hiển thị điểm khác biệt
                            </span>
                        </label>
                    </div>

                    {/* Compare Table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <CompareTableHeader products={products} onRemove={handleRemove} />
                                <CompareTableBody
                                    products={products}
                                    showOnlyDifferences={showOnlyDifferences}
                                    differenceSpecs={differenceSpecs}
                                />
                            </table>
                        </div>
                    </div>

                    {/* Tips Footer */}
                    <div className="mt-8 bg-slate-100 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200/30 dark:border-slate-800/30 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            💡 Mẹo: Bật chức năng "Chỉ hiển thị điểm khác biệt" để lọc nhanh các thông số cấu hình không giống nhau giữa các dòng máy.
                        </p>
                    </div>
                    
                </div>
            </div>
        </AppLayout>
    );
}
