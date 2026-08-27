import AppLayout from '@/Layouts/AppLayout';
import Hero from '@/Components/Hero';
import ProductCard from '@/Components/ProductCard';
import { Head, Link } from '@inertiajs/react';
import { Sparkles, Shield, Zap, Award } from 'lucide-react';

const SectionHeader = ({ title, link }: { title: string, link: string }) => (
    <div className="flex items-end justify-between mb-10 border-b border-slate-150/60 dark:border-slate-800/80 pb-5">
        <div className="relative">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight transition-colors">
                {title}
            </h2>
            <div className="absolute -bottom-[21px] left-0 h-1 w-20 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full" />
        </div>
        <Link href={link} className="text-indigo-600 dark:text-indigo-400 font-black hover:gap-3 flex items-center gap-1.5 transition-all group text-xs uppercase tracking-wider">
            Xem tất cả 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
    </div>
);

export default function Home({ featured_products, sections }: any) {
    const gamingLaptops = sections.find((s: any) => s.slug === 'laptop-gaming')?.products || [];

    return (
        <AppLayout>
            <Head title="FlashTech - Hệ thống Laptop & Linh kiện hàng đầu" />

            {/* 1. HERO SECTION */}
            <div className="mb-20">
                <Hero />
            </div>

            {/* 2. CATEGORY GRID (Danh mục phổ biến) */}
            <section className="py-16 mb-16">
                <SectionHeader title="Danh mục nổi bật" link="/products" />
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {sections.map((cat: any) => {
                        let icon = (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        );
                        
                        if (cat.slug === 'linh-kien') icon = (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                        );
                        if (cat.slug === 'phu-kien') icon = (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                        );

                        return (
                            <Link
                                key={cat.id}
                                href={`/products?category=${cat.slug}`}
                                className="group relative p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-indigo-50 dark:bg-indigo-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-60" />
                                
                                <div className="relative z-10 w-14 h-14 mb-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-indigo-650 dark:text-indigo-400 group-hover:bg-indigo-650 group-hover:text-white dark:group-hover:text-slate-950 transition-all duration-350 transform group-hover:rotate-6">
                                    {icon}
                                </div>
                                
                                <span className="relative z-10 font-bold text-slate-850 dark:text-slate-200 group-hover:text-indigo-650 dark:group-hover:text-indigo-450 transition-colors uppercase tracking-wider text-[11px]">
                                    {cat.name}
                                </span>
                                
                                <span className="mt-1.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    {cat.products_count || 0} sản phẩm
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 3. FEATURED PRODUCTS */}
            <section className="py-16 mb-16">
                <SectionHeader title="Sản phẩm bán chạy" link="/products?filter=featured" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {featured_products.slice(0, 8).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* 4. GAMING UNIVERSE SECTION (DARK THEMED REDESIGNED) */}
            {gamingLaptops.length > 0 && (
                <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-950 dark:to-slate-900 rounded-[3.5rem] text-white my-20 relative overflow-hidden px-6 md:px-12 border border-slate-800">
                    {/* Glowing design blobs */}
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                            <div>
                                <span className="text-indigo-400 font-bold uppercase tracking-[0.25em] text-[10px] flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" /> Phân khúc Gaming Cao Cấp
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black font-display mt-2 tracking-tight">
                                    Gaming Universe
                                </h2>
                                <p className="text-slate-400 mt-2 max-w-md text-xs sm:text-sm font-medium">
                                    Chiến game mượt mà với những cấu hình tối tân nhất, màn hình tần số quét siêu tốc.
                                </p>
                            </div>
                            <Link href="/products?category=laptop-gaming" className="text-indigo-400 hover:text-white font-bold transition-colors flex items-center gap-1.5 group text-xs uppercase tracking-wider">
                                Khám phá vũ trụ game <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {gamingLaptops.slice(0, 4).map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. PROMOTION BANNER */}
            <section className="mb-20 relative overflow-hidden rounded-[3.5rem] bg-gradient-to-r from-slate-900 to-indigo-950 p-8 md:p-16 text-white border border-indigo-950 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <span className="text-indigo-400 font-bold uppercase tracking-[0.25em] text-[10px] block">Ưu đãi độc quyền</span>
                        <h2 className="text-3xl md:text-5xl font-black font-display leading-tight text-white tracking-tight">
                            Nâng cấp RAM <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">Miễn phí lắp đặt</span>
                        </h2>
                        <p className="text-slate-350 text-sm md:text-base max-w-md font-medium leading-relaxed">
                            Dành riêng cho khách hàng sở hữu Laptop tại FlashTech trong tháng này. Tối ưu hóa hiệu năng ngay tại cửa hàng.
                        </p>
                        <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-900/40 text-xs uppercase tracking-wider">
                            Tìm mua Laptop ngay <Zap className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="hidden md:block relative">
                        <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-3xl" />
                        <img
                            src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop"
                            className="rounded-[2.5rem] shadow-2xl border-4 border-slate-800 rotate-2 hover:rotate-0 transition-transform duration-500 object-cover max-h-[300px] w-full"
                            alt="Promotion"
                        />
                    </div>
                </div>
            </section>

            {/* 6. DYNAMIC SECTIONS (Tự động hiển thị sản phẩm theo danh mục) */}
            {sections.map((section: any, index: number) => (
                <section
                    key={section.id}
                    className={`py-16 px-4 md:px-8 mb-12 rounded-[3.5rem] transition-colors duration-300 border ${
                        index % 2 === 0 
                            ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-900/50' 
                            : 'bg-transparent border-transparent'
                    }`}
                >
                    <div className="max-w-7xl mx-auto">
                        <SectionHeader
                            title={section.name}
                            link={`/products?category=${section.slug}`}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {section.products.slice(0, 4).map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* 7. TRUST BADGES */}
            <section className="py-16 grid md:grid-cols-3 gap-8 border-t border-slate-150 dark:border-slate-850/80 mt-16 text-slate-800 dark:text-slate-200">
                <div className="text-center space-y-3 p-6 bg-slate-50/40 dark:bg-slate-900/20 rounded-[2rem] border border-slate-100/50 dark:border-slate-900/40">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-650 dark:text-indigo-400 mx-auto">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-black font-display uppercase tracking-wider text-slate-850 dark:text-slate-150">Giao hàng hỏa tốc</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Nhận máy liền tay trong 2 giờ tại nội thành</p>
                </div>
                <div className="text-center space-y-3 p-6 bg-slate-50/40 dark:bg-slate-900/20 rounded-[2rem] border border-slate-100/50 dark:border-slate-900/40">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-650 dark:text-indigo-400 mx-auto">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-black font-display uppercase tracking-wider text-slate-850 dark:text-slate-150">Bảo hành 12 tháng</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Yên tâm sử dụng, lỗi 1 đổi 1 trong 30 ngày</p>
                </div>
                <div className="text-center space-y-3 p-6 bg-slate-50/40 dark:bg-slate-900/20 rounded-[2rem] border border-slate-100/50 dark:border-slate-900/40">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-650 dark:text-indigo-400 mx-auto">
                        <Award className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-black font-display uppercase tracking-wider text-slate-850 dark:text-slate-150">Cam kết chính hãng</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Hoàn tiền 200% nếu phát hiện hàng giả hàng nhái</p>
                </div>
            </section>
        </AppLayout>
    );
}
