import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, ChevronRight } from 'lucide-react';
import ProductCard from '@/Components/ProductCard';

interface Props {
    products: any;
    brands: any[];
    categories: any[];
    filters: any;
}

const PRICE_RANGES = [
    { label: 'Dưới 15 triệu',  min: 0,          max: 15_000_000 },
    { label: '15 – 25 triệu',  min: 15_000_000,  max: 25_000_000 },
    { label: '25 – 40 triệu',  min: 25_000_000,  max: 40_000_000 },
    { label: 'Trên 40 triệu',  min: 40_000_000,  max: ''         },
];

const vnd = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function ProductsIndex({ products, brands, categories, filters }: Props) {
    const [min, setMin] = useState<string>(filters.min_price ?? '');
    const [max, setMax] = useState<string>(filters.max_price ?? '');
    const [searchVal, setSearchVal] = useState<string>(filters.search ?? '');

    // Sync search input state with filters from URL query
    useEffect(() => {
        setSearchVal(filters.search ?? '');
    }, [filters.search]);

    const go = (patch: Record<string, any>) => {
        const next: Record<string, any> = {};
        Object.entries({ ...filters, ...patch }).forEach(([k, v]) => {
            if (v !== '' && v !== null && v !== undefined) next[k] = v;
        });
        router.get(route('products.index'), next, { preserveState: true, preserveScroll: true, replace: true });
    };

    const reset = () => {
        setMin('');
        setMax('');
        setSearchVal('');
        router.get(route('products.index'), {});
    };
    
    const hasFilter = Object.keys(filters).length > 0;

    const activeCategory = filters.category
        ? categories.find((c: any) => c.slug === filters.category)
        : null;

    return (
        <AppLayout>
            <Head title="Cửa hàng – FlashTech" />

            <div className="py-6">
                {/* ─── BREADCRUMB + TITLE ─── */}
                <div className="mb-10">
                    <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                        <Link href="/" className="hover:text-indigo-605 transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                        <Link href={route('products.index')} className="hover:text-indigo-655 transition-colors">Cửa hàng</Link>
                        {activeCategory && (
                            <>
                                <ChevronRight className="w-3 h-3 opacity-60" />
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{activeCategory.name}</span>
                            </>
                        )}
                    </nav>

                    <div className="flex items-baseline gap-4 mt-2">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                            {activeCategory ? activeCategory.name : 'Tất cả sản phẩm'}
                        </h1>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {products.total} sản phẩm
                        </span>
                    </div>
                </div>

                {/* ─── FILTER PILLS (active) ─── */}
                <AnimatePresence>
                    {hasFilter && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-2 mb-8 overflow-hidden"
                        >
                            {filters.search && (
                                <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-750 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl">
                                    Từ khóa: "{filters.search}"
                                    <button onClick={() => go({ search: null })} className="hover:text-rose-505 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.category && (
                                <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-xl">
                                    {categories.find((c: any) => c.slug === filters.category)?.name}
                                    <button onClick={() => go({ category: null })} className="hover:text-rose-505 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.brand && (
                                <span className="inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200/50 dark:border-purple-500/20 text-purple-650 dark:text-purple-400 text-xs font-semibold px-3 py-1.5 rounded-xl">
                                    {brands.find((b: any) => b.slug === filters.brand)?.name}
                                    <button onClick={() => go({ brand: null })} className="hover:text-rose-505 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {(filters.min_price || filters.max_price) && (
                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-emerald-650 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-xl">
                                    Giá: {filters.min_price ? vnd(+filters.min_price) : '0đ'} – {filters.max_price ? vnd(+filters.max_price) : 'Vô cùng'}
                                    <button onClick={() => go({ min_price: null, max_price: null })} className="hover:text-rose-505 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-rose-505 transition-colors px-2">
                                <X className="w-3.5 h-3.5" /> Xóa bộ lọc
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── MAIN LAYOUT ─── */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* ═══ SIDEBAR ═══ */}
                    <aside className="w-full lg:w-[260px] flex-shrink-0">
                        <div className="sticky top-28 space-y-8 bg-white dark:bg-slate-900/60 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none backdrop-blur-xl">
                            {/* Search input in sidebar */}
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Tìm kiếm
                                </p>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-650 dark:group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Tìm sản phẩm..."
                                        value={searchVal}
                                        onChange={e => setSearchVal(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                go({ search: searchVal || null });
                                            }
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                                    />
                                    {searchVal && (
                                        <button 
                                            onClick={() => {
                                                setSearchVal('');
                                                go({ search: null });
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* ── Danh mục ── */}
                            <div className="space-y-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Danh mục
                                </p>
                                <div className="space-y-1">
                                    {[{ name: 'Tất cả sản phẩm', slug: null }, ...categories].map((cat: any) => {
                                        const active = cat.slug === null ? !filters.category : filters.category === cat.slug;
                                        return (
                                            <button 
                                                key={cat.slug ?? 'all'} 
                                                onClick={() => go({ category: cat.slug })}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs transition-all text-left font-bold ${
                                                    active
                                                        ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-600/25 translate-x-1'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                            >
                                                <span>{cat.name}</span>
                                                {active && <Check className="w-3.5 h-3.5" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Thương hiệu ── */}
                            <div className="space-y-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Thương hiệu
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {brands.map((b: any) => {
                                        const active = filters.brand === b.slug;
                                        return (
                                            <button 
                                                key={b.id} 
                                                onClick={() => go({ brand: active ? null : b.slug })}
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                                    active
                                                        ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-650/20 scale-105'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-650 dark:hover:text-purple-400 bg-slate-50 dark:bg-slate-950/30'
                                                }`}
                                            >
                                                {b.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Khoảng giá ── */}
                            <div className="space-y-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Khoảng giá
                                </p>
                                <div className="space-y-1">
                                    {PRICE_RANGES.map(r => {
                                        const active =
                                            String(filters.min_price ?? '') === String(r.min) &&
                                            String(filters.max_price ?? '') === String(r.max);
                                        return (
                                            <button 
                                                key={r.label} 
                                                onClick={() => go({ min_price: r.min, max_price: r.max })}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs transition-all text-left font-bold ${
                                                    active
                                                        ? 'bg-emerald-650 text-white shadow-lg shadow-emerald-600/25 translate-x-1'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                            >
                                                <span>{r.label}</span>
                                                {active && <Check className="w-3.5 h-3.5" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom price input */}
                                <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/80 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            placeholder="Min" 
                                            value={min} 
                                            onChange={e => setMin(e.target.value)}
                                            className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors font-semibold"
                                        />
                                        <span className="text-slate-400 font-bold">-</span>
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            value={max} 
                                            onChange={e => setMax(e.target.value)}
                                            className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors font-semibold"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => go({ min_price: min || null, max_price: max || null })}
                                        className="w-full py-2.5 bg-slate-900 dark:bg-white hover:bg-emerald-650 dark:hover:bg-emerald-500 active:scale-[0.98] text-white dark:text-slate-900 dark:hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ═══ PRODUCT GRID ═══ */}
                    <div className="flex-grow min-w-0">
                        {products.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    <AnimatePresence mode="popLayout">
                                        {products.data.map((product: any, idx: number) => (
                                            <motion.div 
                                                key={product.id} 
                                                layout
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.97 }}
                                                transition={{ delay: idx * 0.03, duration: 0.25 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination with fixed light mode colors */}
                                {products.last_page > 1 && (
                                    <div className="mt-12 flex justify-center items-center gap-1.5">
                                        {/* Prev */}
                                        {products.current_page > 1 ? (
                                            <Link
                                                href={`${route('products.index')}?page=${products.current_page - 1}`}
                                                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                            >
                                                ← Trước
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-350 dark:text-slate-650 cursor-not-allowed">
                                                ← Trước
                                            </span>
                                        )}

                                        {/* Page numbers */}
                                        {Array.from({ length: products.last_page }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === products.last_page || Math.abs(p - products.current_page) <= 1)
                                            .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                                                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
                                                acc.push(p);
                                                return acc;
                                            }, [])
                                            .map((p, i) =>
                                                p === 'ellipsis' ? (
                                                    <span key={`e${i}`} className="px-2 text-slate-400 dark:text-slate-600 text-xs font-bold">···</span>
                                                ) : (
                                                    <Link
                                                        key={p}
                                                        href={`${route('products.index')}?page=${p}`}
                                                        className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm ${
                                                            p === products.current_page
                                                                ? 'bg-indigo-650 text-white dark:bg-indigo-600 shadow-md shadow-indigo-500/20'
                                                                : 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                                                        }`}
                                                    >
                                                        {p}
                                                    </Link>
                                                )
                                            )
                                        }

                                        {/* Next */}
                                        {products.current_page < products.last_page ? (
                                            <Link
                                                href={`${route('products.index')}?page=${products.current_page + 1}`}
                                                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                            >
                                                Tiếp →
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-350 dark:text-slate-650 cursor-not-allowed">
                                                Tiếp →
                                            </span>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-28 text-center bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-100 dark:border-slate-800/80 shadow-md">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5 border border-slate-100 dark:border-slate-700">
                                    <Search className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-lg font-black text-slate-855 dark:text-white mb-2 font-display">Không tìm thấy sản phẩm</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-7 max-w-xs leading-relaxed">
                                    Không có chiếc laptop nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng thử lại.
                                </p>
                                <button 
                                    onClick={reset}
                                    className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-500/10"
                                >
                                    Xem tất cả sản phẩm
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
