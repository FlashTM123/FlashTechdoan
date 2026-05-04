import AppLayout from '@/Layouts/AppLayout';
import Hero from '@/Components/Hero';
import ProductCard from '@/Components/ProductCard';
import { Head, Link } from '@inertiajs/react';

// Thành phần phụ: Tiêu đề cho mỗi Section (Đã nâng cấp gạch chân)
const SectionHeader = ({ title, link }: { title: string, link: string }) => (
    <div className="flex items-end justify-between mb-12">
        <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight transition-colors">
                {title}
            </h2>
            {/* Gạch chân màu tím tinh tế */}
            <div className="absolute -bottom-3 left-0 h-1.5 w-16 bg-indigo-600 rounded-full shadow-sm shadow-indigo-100"></div>
        </div>
        <Link href={link} className="text-indigo-600 font-bold hover:gap-3 flex items-center gap-2 transition-all group text-sm uppercase tracking-widest">
            Xem tất cả 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
    </div>
);

export default function Home({ featured_products, sections }: any) {
    // --- BƯỚC 1: LOGIC LỌC SẢN PHẨM GAMING ---
    // Tìm trong mảng danh mục (sections) cái nào có slug là 'laptop-gaming' để lấy sản phẩm của nó
    const gamingLaptops = sections.find((s: any) => s.slug === 'laptop-gaming')?.products || [];

    return (
        <AppLayout>
            <Head title="FlashTech - Hệ thống Laptop & Linh kiện hàng đầu" />

            {/* 1. HERO SECTION */}
            <Hero />

            {/* 2. CATEGORY GRID (Danh mục phổ biến) */}
            <section className="py-24">
                <SectionHeader title="Danh mục phổ biến" link="/products" />
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {sections.map((cat: any) => {
                        // Logic chọn icon dựa trên slug
                        let icon = (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        ); // Default Laptop Icon
                        
                        if (cat.slug === 'linh-kien') icon = (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                        );
                        if (cat.slug === 'phu-kien') icon = (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                        );

                        return (
                            <Link
                                key={cat.id}
                                href={`/products?category=${cat.slug}`}
                                className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
                            >
                                {/* Background trang trí nhỏ */}
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50"></div>
                                
                                <div className="relative z-10 w-16 h-16 mb-6 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-[10deg]">
                                    {icon}
                                </div>
                                
                                <span className="relative z-10 font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-wider text-xs">
                                    {cat.name}
                                </span>
                                
                                <span className="mt-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 uppercase tracking-[0.2em]">
                                    {cat.products_count || 0} sản phẩm
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 3. FEATURED PRODUCTS */}
            <section className="py-24">
                <SectionHeader title="Sản phẩm nổi bật" link="/products?filter=featured" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featured_products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* --- BƯỚC 2: GAMING UNIVERSE SECTION (DARK MODE) --- */}
            {/* Phần này chỉ hiện nếu thực sự có sản phẩm Gaming */}
            {gamingLaptops.length > 0 && (
                <section className="py-24 bg-slate-900 rounded-[4rem] text-white my-12 relative overflow-hidden mx-[-1rem] px-4 md:px-12">
                    {/* Hiệu ứng ánh sáng xanh tím huyền ảo ở nền */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <span className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px]">Phân khúc cao cấp</span>
                                <h2 className="text-4xl md:text-5xl font-black font-display mt-3 tracking-tight">
                                    🔥 Gaming Universe
                                </h2>
                                <p className="text-slate-400 mt-4 max-w-md text-sm font-medium">
                                    Đánh bại mọi đối thủ với dòng laptop cấu hình khủng, màn hình tần số quét cao nhất.
                                </p>
                            </div>
                            <Link href="/products?category=laptop-gaming" className="text-indigo-400 font-bold hover:text-white transition-colors flex items-center gap-2 group text-sm uppercase tracking-widest">
                                Khám phá ngay <span className="group-hover:translate-x-2 transition-transform">→</span>
                            </Link>
                        </div>

                        {/* Danh sách sản phẩm Gaming (Dùng ProductCard với prop dark) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {gamingLaptops.slice(0, 4).map((product: any) => (
                                <ProductCard key={product.id} product={product} dark={true} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 4. PROMOTION BANNER */}
            <section className="mb-24 relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 md:p-16 text-white mx-4">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/20 blur-[120px] -rotate-12 translate-x-1/4"></div>
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs">Ưu đãi độc quyền</span>
                        <h2 className="text-4xl md:text-5xl font-black font-display mt-4 mb-6 leading-tight text-white">
                            Nâng cấp RAM <br /> Miễn phí lắp đặt
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-md font-medium leading-relaxed">
                            Dành riêng cho khách hàng mua Laptop Gaming tại FlashTech trong tháng này.
                        </p>
                        <Link href="/products?category=linh-kien" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all inline-block shadow-lg shadow-indigo-900/20">
                            Khám phá ngay
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <img
                            src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop"
                            className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
                            alt="Promotion"
                        />
                    </div>
                </div>
            </section>

            {/* 5. DYNAMIC SECTIONS (Tự động lặp qua các danh mục) */}
            {sections.map((section: any, index: number) => (
                <section
                    key={section.id}
                    className={`py-24 -mx-4 px-4 mb-12 transition-colors duration-300 ${
                        index % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/50 rounded-[4rem]' : 'bg-white dark:bg-slate-950'
                    }`}
                >
                    <div className="max-w-7xl mx-auto">
                        <SectionHeader
                            title={section.name}
                            link={`/products?category=${section.slug}`}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {section.products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* 6. TRUST BADGES */}
            <section className="py-24 grid md:grid-cols-3 gap-12 border-t border-slate-100 mt-12">
                <div className="text-center space-y-4">
                    <div className="text-4xl">🚀</div>
                    <h4 className="text-xl font-bold font-display text-slate-800 uppercase tracking-tight">Giao hàng hỏa tốc</h4>
                    <p className="text-slate-500 text-sm">Nhận hàng trong 2h tại nội thành</p>
                </div>
                <div className="text-center space-y-4 border-x border-slate-100">
                    <div className="text-4xl">🛡️</div>
                    <h4 className="text-xl font-bold font-display text-slate-800 uppercase tracking-tight">Bảo hành 12 tháng</h4>
                    <p className="text-slate-500 text-sm">Lỗi 1 đổi 1 trong vòng 30 ngày</p>
                </div>
                <div className="text-center space-y-4">
                    <div className="text-4xl">💎</div>
                    <h4 className="text-xl font-bold font-display text-slate-800 uppercase tracking-tight">Cam kết chính hãng</h4>
                    <p className="text-slate-500 text-sm">Hoàn tiền 200% nếu phát hiện hàng giả</p>
                </div>
            </section>
        </AppLayout>
    );
}
