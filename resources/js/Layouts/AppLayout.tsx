import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Footer from '@/Components/Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    // 1. Lấy dữ liệu categories được chia sẻ từ HandleInertiaRequests.php
    const { categories } = usePage().props as any;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Hiệu ứng đổi màu Navbar khi cuộn trang
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            {/* --- NAVBAR --- */}
            <nav className={`sticky top-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
                }`}>
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    {/* LOGO */}
                    <Link href="/" className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent font-display tracking-tighter">
                        FlashTech
                    </Link>

                    {/* MENU CHÍNH */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="font-semibold hover:text-indigo-600 transition text-sm uppercase tracking-wider">Trang chủ</Link>

                        {/* DROPDOWN DANH MỤC */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button className={`flex items-center gap-1 font-semibold transition text-sm uppercase tracking-wider ${isDropdownOpen ? 'text-indigo-600' : ''}`}>
                                Sản phẩm
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                /*
                                   QUAN TRỌNG:
                                   1. Tôi bỏ "mt-2" (margin top) vì nó tạo ra khoảng trống gây lỗi.
                                   2. Tôi thêm "pt-4" (padding top) để tạo một 'chiếc cầu' tàng hình nối liền nút và menu.
                                */
                                <div className="absolute top-full left-0 w-64 pt-4 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Đây là cái hộp nội dung thực sự, ta đổ bóng và bo góc ở đây */}
                                    <div className="bg-white shadow-2xl rounded-2xl p-3 border border-slate-100">
                                        <div className="grid gap-1">
                                            {categories?.map((cat: any) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/products?category=${cat.slug}`}
                                                    className="flex items-center justify-between px-4 py-3 hover:bg-indigo-50 rounded-xl group/item transition-all"
                                                >
                                                    <span className="font-bold text-slate-700 group-hover/item:text-indigo-600 transition-colors">{cat.name}</span>
                                                    <svg className="w-4 h-4 text-slate-300 group-hover/item:text-indigo-400 transform -translate-x-2 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                </Link>
                                            ))}
                                            <hr className="my-2 border-slate-50" />
                                            <Link href="/products" className="text-center py-2 text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">Xem tất cả</Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/about" className="font-semibold hover:text-indigo-600 transition text-sm uppercase tracking-wider">Về chúng tôi</Link>
                    </div>

                    {/* ICON ACTIONS (Giỏ hàng, Tìm kiếm, User) */}
                    <div className="flex items-center gap-5">
                        <button className="p-2 hover:bg-white rounded-full transition-colors relative group">
                            <svg className="w-6 h-6 text-slate-700 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>

                        <Link href="/cart" className="p-2 hover:bg-white rounded-full transition-colors relative group">
                            <svg className="w-6 h-6 text-slate-700 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">0</span>
                        </Link>

                        <Link href="/login" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- NỘI DUNG TRANG --- */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>

            {/* --- FOOTER --- */}
            <Footer />
        </div>
    );
}
