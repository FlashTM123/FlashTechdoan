import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '@/Components/Footer';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Moon, Sun, ChevronDown, Loader2, Menu, X } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    // 1. Lấy dữ liệu categories và auth được chia sẻ từ HandleInertiaRequests.php
    const { categories, auth } = usePage().props as any;

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

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden">
            {/* --- NAVBAR --- */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b",
                isScrolled 
                    ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl py-3 shadow-lg border-slate-100 dark:border-slate-800" 
                    : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-5 md:py-6 border-transparent"
            )}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-8 flex items-center justify-between gap-4 md:gap-12">
                    {/* MOBILE HAMBURGER - Chỉ hiện trên Mobile */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* LOGO */}
                    <Link href="/" className="text-2xl md:text-3xl font-black bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent font-display tracking-tighter hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        FlashTech
                    </Link>

                    {/* MENU CHÍNH - Ẩn trên Mobile */}
                    <div className="hidden lg:flex items-center gap-8 flex-shrink-0">
                        <div
                            className="relative"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button className={cn(
                                "flex items-center gap-1.5 font-bold transition-all text-[11px] uppercase tracking-widest hover:text-indigo-600",
                                isDropdownOpen ? "text-indigo-600" : "text-slate-600 dark:text-slate-300"
                            )}>
                                Sản phẩm
                                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isDropdownOpen && "rotate-180")} strokeWidth={3} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 w-64 pt-6 z-[110]"
                                    >
                                        <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-4 border border-slate-100 dark:border-slate-800 backdrop-blur-2xl">
                                            <div className="grid gap-1.5">
                                                {categories?.map((cat: any) => (
                                                    <Link key={cat.id} href={`/products?category=${cat.slug}`} className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl group/item transition-all">
                                                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">{cat.name}</span>
                                                        <ChevronDown className="w-4 h-4 text-slate-300 group-hover/item:text-indigo-400 -rotate-90 transform" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <Link href="/about" className="font-bold hover:text-indigo-600 transition text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400">Về chúng tôi</Link>
                    </div>

                    {/* --- LIVE SEARCH BAR - Ẩn trên Mobile, chỉ hiện trên Desktop lớn --- */}
                    <div className="flex-grow max-w-md relative hidden xl:block">
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            </span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm Laptop..."
                                className="w-full bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ICON ACTIONS */}
                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                        {/* Search Icon cho Mobile */}
                        <button className="xl:hidden p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all">
                            <Search className="w-5 h-5 md:w-4 md:h-4" />
                        </button>

                        <button onClick={toggleDarkMode} className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90">
                            {isDarkMode ? <Sun className="w-5 h-5 md:w-4 md:h-4 text-yellow-400" /> : <Moon className="w-5 h-5 md:w-4 md:h-4 text-slate-600" />}
                        </button>

                        <Link href="/cart" className="relative p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all group">
                            <ShoppingCart className="w-5 h-5 md:w-4 md:h-4 group-hover:text-indigo-600 transition-colors" />
                            <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-slate-50 dark:border-slate-950">
                                0
                            </span>
                        </Link>

                        {/* --- USER PROFILE / AUTH --- */}
                        {auth.user ? (
                            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800 ml-2">
                                <div className="hidden md:flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider leading-none">
                                            {auth.user.name}
                                        </span>
                                        {(auth.user.role === 'admin' || auth.user.role === 'moderator') && (
                                            <span className="text-[8px] font-black bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Staff</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {(auth.user.role === 'admin' || auth.user.role === 'moderator') && (
                                            <a 
                                                href="/admin" 
                                                className="text-[9px] font-bold text-amber-600 dark:text-amber-500 hover:underline"
                                            >
                                                Dashboard
                                            </a>
                                        )}
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Đăng xuất
                                        </Link>
                                    </div>
                                </div>
                                <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-200 dark:shadow-none transform hover:rotate-6 transition-transform">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link 
                                    href={route('login')} 
                                    className="hidden md:block px-5 py-2.5 text-slate-600 dark:text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    href={route('register')} 
                                    className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
                                >
                                    Join
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="p-6 flex flex-col gap-4">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Danh mục</div>
                                {categories?.map((cat: any) => (
                                    <Link key={cat.id} href={`/products?category=${cat.slug}`} className="text-lg font-bold text-slate-700 dark:text-slate-200 py-2">
                                        {cat.name}
                                    </Link>
                                ))}
                                <hr className="border-slate-100 dark:border-slate-800 my-2" />
                                <Link href="/about" className="text-lg font-bold text-slate-700 dark:text-slate-200 py-2">Về chúng tôi</Link>
                                <Link href="/login" className="sm:hidden text-lg font-bold text-indigo-600 py-2">Đăng nhập</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* --- NỘI DUNG TRANG --- */}
            <main className="flex-grow pt-[80px] md:pt-[100px]">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* --- FOOTER --- */}
            <Footer />

            {/* Global Toaster */}
            <Toaster position="bottom-right" richColors theme={isDarkMode ? 'dark' : 'light'} />
        </div>
    );
}
