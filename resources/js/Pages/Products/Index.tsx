import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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

    const go = (patch: Record<string, any>) => {
        const next: Record<string, any> = {};
        Object.entries({ ...filters, ...patch }).forEach(([k, v]) => {
            if (v !== '' && v !== null && v !== undefined) next[k] = v;
        });
        router.get(route('products.index'), next, { preserveState: true, preserveScroll: true, replace: true });
    };

    const reset = () => router.get(route('products.index'), {});
    const hasFilter = Object.keys(filters).length > 0;

    const activeCategory = filters.category
        ? categories.find((c: any) => c.slug === filters.category)
        : null;

    // Checkbox component
    const FilterCheck = ({ active, color = 'indigo' }: { active: boolean; color?: string }) => (
        <span className={`w-[18px] h-[18px] rounded-[5px] border-2 flex-shrink-0 grid place-items-center transition-all ${
            active
                ? color === 'violet'
                    ? 'bg-violet-600 border-violet-500'
                    : 'bg-indigo-600 border-indigo-500'
                : 'border-slate-300 dark:border-slate-600 bg-transparent'
        }`}>
            {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />}
        </span>
    );

    return (
        <AppLayout>
            <Head title="Cửa hàng – FlashTech" />

            <div>
                {/* ─── BREADCRUMB + TITLE ─── */}
                <div className="mb-8">
                    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500 mb-3">
                        <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <Link href={route('products.index')} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Cửa hàng</Link>
                        {activeCategory && (
                            <>
                                <ChevronRight className="w-3 h-3 opacity-50" />
                                <span className="text-indigo-500 font-medium">{activeCategory.name}</span>
                            </>
                        )}
                    </nav>

                    <div className="flex items-baseline gap-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {activeCategory ? activeCategory.name : 'Tất cả sản phẩm'}
                        </h1>
                        <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
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
                            className="flex flex-wrap gap-2 mb-6 overflow-hidden"
                        >
                            {filters.category && (
                                <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    {categories.find((c: any) => c.slug === filters.category)?.name}
                                    <button onClick={() => go({ category: null })} className="hover:text-indigo-900 dark:hover:text-white transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.brand && (
                                <span className="inline-flex items-center gap-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/25 text-violet-600 dark:text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    {brands.find((b: any) => b.slug === filters.brand)?.name}
                                    <button onClick={() => go({ brand: null })} className="hover:text-violet-900 dark:hover:text-white transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {(filters.min_price || filters.max_price) && (
                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    {filters.min_price ? vnd(+filters.min_price) : '0đ'} – {filters.max_price ? vnd(+filters.max_price) : '∞'}
                                    <button onClick={() => go({ min_price: null, max_price: null })} className="hover:text-emerald-900 dark:hover:text-white transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors px-2">
                                <X className="w-3 h-3" /> Xóa tất cả
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── MAIN LAYOUT ─── */}
                <div className="flex gap-8">

                    {/* ═══ SIDEBAR ═══ */}
                    <aside className="hidden lg:block w-[240px] flex-shrink-0">
                        <div className="sticky top-[120px] space-y-8 bg-white/50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 backdrop-blur-xl shadow-lg shadow-indigo-500/5">

                            {/* Search */}
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Tìm sản phẩm..."
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                />
                            </div>

                            {/* ── Danh mục ── */}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Danh mục
                                </p>
                                <div className="space-y-1">
                                    {[{ name: 'Tất cả', slug: null }, ...categories].map((cat: any) => {
                                        const active = cat.slug === null ? !filters.category : filters.category === cat.slug;
                                        return (
                                            <button key={cat.slug ?? 'all'} onClick={() => go({ category: cat.slug })}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left font-medium ${
                                                    active
                                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 translate-x-1'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
                                                }`}
                                            >
                                                {cat.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-200 dark:bg-slate-800" />

                            {/* ── Thương hiệu ── */}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-violet-500"></span> Thương hiệu
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {brands.map((b: any) => (
                                        <button key={b.id} onClick={() => go({ brand: filters.brand === b.slug ? null : b.slug })}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                                filters.brand === b.slug
                                                    ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-600/20 scale-105'
                                                    : 'border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:border-violet-400 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-200 dark:bg-slate-800" />

                            {/* ── Khoảng giá ── */}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mức giá
                                </p>
                                <div className="space-y-1">
                                    {PRICE_RANGES.map(r => {
                                        const active =
                                            String(filters.min_price ?? '') === String(r.min) &&
                                            String(filters.max_price ?? '') === String(r.max);
                                        return (
                                            <button key={r.label} onClick={() => go({ min_price: r.min, max_price: r.max })}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all text-left font-medium ${
                                                    active
                                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
                                                }`}
                                            >
                                                {r.label}
                                                {active && <Check className="w-4 h-4" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom price */}
                                <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="Từ" value={min} onChange={e => setMin(e.target.value)}
                                            className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors font-medium"
                                        />
                                        <span className="text-slate-400 font-bold">-</span>
                                        <input type="number" placeholder="Đến" value={max} onChange={e => setMax(e.target.value)}
                                            className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors font-medium"
                                        />
                                    </div>
                                    <button onClick={() => go({ min_price: min, max_price: max })}
                                        className="w-full py-2.5 bg-slate-900 dark:bg-white hover:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-[0.98] text-white dark:text-slate-900 dark:hover:text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md">
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ═══ PRODUCT GRID ═══ */}
                    <div className="flex-1 min-w-0">
                        {products.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    <AnimatePresence mode="popLayout">
                                        {products.data.map((product: any, idx: number) => (
                                            <motion.div key={product.id} layout
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.97 }}
                                                transition={{ delay: idx * 0.04, duration: 0.28 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-12 flex justify-center items-center gap-1.5">
                                        {/* Prev */}
                                        {products.current_page > 1 ? (
                                            <Link
                                                href={`${route('products.index')}?page=${products.current_page - 1}`}
                                                className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                                            >
                                                ← Trước
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800/40 border border-slate-800 text-slate-700 cursor-not-allowed">
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
                                                    <span key={`e${i}`} className="px-2 text-slate-600 text-sm">···</span>
                                                ) : (
                                                    <Link
                                                        key={p}
                                                        href={`${route('products.index')}?page=${p}`}
                                                        className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                                                            p === products.current_page
                                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                                                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
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
                                                className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                                            >
                                                Tiếp →
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800/40 border border-slate-800 text-slate-700 cursor-not-allowed">
                                                Tiếp →
                                            </span>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-28 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center mb-5">
                                    <Search className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-7 max-w-xs">
                                    Không có sản phẩm nào phù hợp với bộ lọc hiện tại
                                </p>
                                <button onClick={reset}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
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
