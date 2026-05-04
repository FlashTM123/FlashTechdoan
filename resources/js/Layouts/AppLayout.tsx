import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '@/Components/Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    // 1. Lấy dữ liệu categories được chia sẻ từ HandleInertiaRequests.php
    const { categories } = usePage().props as any;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Live Search States
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Dark Mode State
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Khởi tạo Dark Mode từ LocalStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    // Logic Live Search với Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 2) {
                setIsSearching(true);
                axios.get(`/api/search?q=${searchTerm}`)
                    .then(res => {
                        setSearchResults(res.data);
                        setShowSuggestions(true);
                    })
                    .finally(() => setIsSearching(false));
            } else {
                setSearchResults([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Hiệu ứng đổi màu Navbar khi cuộn trang
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-300">
            {/* --- NAVBAR --- */}
            <nav className={`sticky top-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
                }`}>
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    {/* LOGO */}
                    <Link href="/" className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent font-display tracking-tighter">
                        FlashTech
                    </Link>

                    {/* MENU CHÍNH */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* <Link href="/" className="font-semibold hover:text-indigo-600 transition text-sm uppercase tracking-wider">Trang chủ</Link> */}

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
                    {/* --- LIVE SEARCH BAR --- */}
                    <div className="flex-1 max-w-md mx-8 hidden lg:block relative">
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                {isSearching ? (
                                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                )}
                            </span>
                            <input
                                type="text"
                                placeholder="Bạn đang tìm Laptop gì?..."
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[120] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2">
                                    <div className="px-3 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sản phẩm gợi ý</div>
                                    {searchResults.map((product: any) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            className="flex items-center gap-4 p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-xl transition-all group"
                                        >
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.image_url || 'https://images.unsplash.com/photo-1517336712461-68d73859524c?q=80&w=200&auto=format&fit=crop'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{product.name}</h4>
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.variants?.[0]?.price || 0)}
                                                </p>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </Link>
                                    ))}
                                    <hr className="my-2 border-slate-50 dark:border-slate-800" />
                                    <Link href={`/products?search=${searchTerm}`} className="block text-center py-2.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white rounded-xl transition-all uppercase tracking-widest">
                                        Xem tất cả kết quả
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ICON ACTIONS (Giỏ hàng, Tìm kiếm, User) */}
                    <div className="flex items-center gap-5">
                        {/* Nút chuyển đổi Dark/Light Mode */}
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group"
                            title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                            ) : (
                                <svg className="w-5 h-5 text-slate-700 group-hover:text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                            )}
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
