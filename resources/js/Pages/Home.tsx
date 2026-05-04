import AppLayout from '@/Layouts/AppLayout';
import Hero from '@/Components/Hero';
import ProductCard from '@/Components/ProductCard';
import { Head, Link } from '@inertiajs/react';

// Thành phần phụ: Tiêu đề cho mỗi Section (Đã nâng cấp gạch chân)
const SectionHeader = ({ title, link }: { title: string, link: string }) => (
    <div className="flex items-end justify-between mb-12">
        <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display tracking-tight">
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
    return (
        <AppLayout>
            <Head title="FlashTech - Hệ thống Laptop & Linh kiện hàng đầu" />

            {/* 1. HERO SECTION */}
            <Hero />

            {/* 2. CATEGORY QUICK LINKS (Dùng dữ liệu từ sections) */}
            <section className="py-12 border-b border-slate-100">
                <div className="flex items-center justify-center gap-6 md:gap-12 overflow-x-auto pb-4 no-scrollbar">
                    {sections.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            className="flex flex-col items-center group min-w-[100px]"
                        >
                            <div className="w-20 h-20 bg-white shadow-sm rounded-[1.5rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 border border-slate-50 group-hover:shadow-xl group-hover:shadow-indigo-100 group-hover:-translate-y-1">
                                <span className="text-2xl font-black font-display uppercase">{cat.name[0]}</span>
                            </div>
                            <span className="mt-4 text-xs font-bold text-slate-500 group-hover:text-indigo-600 uppercase tracking-widest transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
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
                    className={`py-24 -mx-4 px-4 mb-12 ${
                        index % 2 === 0 ? 'bg-slate-50 rounded-[4rem]' : 'bg-white'
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
