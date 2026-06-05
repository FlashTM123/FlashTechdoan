import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Footer from '@/Components/Footer';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Moon, Sun, ChevronDown, Loader2, Menu, X, BarChart3 } from 'lucide-react';
import UserDropdown from '@/Components/UserDropdown';
import { CartProvider, useCart } from '@/Context/CartContext';
import { useCompare } from '@/hooks/useCompare';

function LayoutContent({ children, isDarkMode, toggleDarkMode, isMobileMenuOpen, setIsMobileMenuOpen, isScrolled, searchTerm, setSearchTerm, isSearching, searchResults, showSuggestions, setShowSuggestions, auth, categories, isDropdownOpen, setIsDropdownOpen, compareCount }: any) {
    const { cart } = useCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [paletteSearch, setPaletteSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const commands = useMemo(() => [
        { id: 'home', name: 'Trang chủ', category: 'Điều hướng', icon: '🏠', action: () => router.visit('/') },
        { id: 'products', name: 'Tất cả sản phẩm', category: 'Điều hướng', icon: '💻', action: () => router.visit('/products') },
        { id: 'gaming', name: 'Laptop Gaming', category: 'Điều hướng', icon: '🎮', action: () => router.visit('/products?category=laptop-gaming') },
        { id: 'cart', name: 'Giỏ hàng của bạn', category: 'Mua sắm', icon: '🛒', action: () => router.visit('/cart') },
        { id: 'compare', name: 'So sánh sản phẩm', category: 'Mua sắm', icon: '📊', action: () => router.visit('/compare') },
        { id: 'dashboard', name: 'Bảng điều khiển', category: 'Tài khoản', icon: '🛡️', action: () => router.visit('/dashboard') },
        { id: 'dark_mode', name: 'Bật/Tắt chế độ tối (Dark Mode)', category: 'Hệ thống', icon: '🌓', action: () => toggleDarkMode() },
        { id: 'support', name: 'Liên hệ hỗ trợ kỹ thuật', category: 'Trợ giúp', icon: '📞', action: () => {
            toast.success("Liên hệ hỗ trợ", {
                description: "Vui lòng gọi hotline 1900 1234 (Miễn phí) để được hỗ trợ lập tức.",
            });
        }},
    ], [toggleDarkMode]);

    const filteredCommands = useMemo(() => {
        return commands.filter(cmd => 
            cmd.name.toLowerCase().includes(paletteSearch.toLowerCase()) || 
            cmd.category.toLowerCase().includes(paletteSearch.toLowerCase())
        );
    }, [commands, paletteSearch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => {
                    if (!prev) {
                        setPaletteSearch("");
                        setSelectedIndex(0);
                    }
                    return !prev;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!isCommandPaletteOpen) return;
        
        const handlePaletteKeys = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    handleExecuteCommand(filteredCommands[selectedIndex]);
                }
            }
        };
        window.addEventListener('keydown', handlePaletteKeys);
        return () => window.removeEventListener('keydown', handlePaletteKeys);
    }, [isCommandPaletteOpen, filteredCommands, selectedIndex]);

    const handleExecuteCommand = (cmd: any) => {
        setIsCommandPaletteOpen(false);
        cmd.action();
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden">
            {/* --- NAVBAR --- */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
                isScrolled 
                    ? "py-4 pointer-events-none" 
                    : "py-6 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-transparent"
            )}>
                <div className={cn(
                    "mx-auto flex items-center justify-between transition-all duration-500",
                    isScrolled 
                        ? "max-w-[1200px] px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-900/20 border border-slate-200/50 dark:border-slate-800/80 rounded-[2rem] pointer-events-auto" 
                        : "max-w-[1440px] px-6 md:px-8 gap-4 md:gap-12"
                )}>
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
                                className="w-full bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl py-2.5 pl-11 pr-16 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500/30 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => {
                                    if (searchResults.length > 0) setShowSuggestions(true);
                                }}
                                onBlur={() => {
                                    // Delay để có thể click được vào kết quả trước khi đóng
                                    setTimeout(() => setShowSuggestions(false), 200);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && searchTerm.trim() !== '') {
                                        router.visit(`/products?search=${encodeURIComponent(searchTerm)}`);
                                    }
                                }}
                            />
                            
                            {/* Keyboard indicator KBD badge */}
                            <kbd 
                                onClick={() => setIsCommandPaletteOpen(true)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-auto text-[9px] font-black text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-300/30 dark:border-slate-700/50 uppercase tracking-widest cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                            >
                                Ctrl K
                            </kbd>

                            <AnimatePresence>
                                {showSuggestions && searchResults.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden z-50"
                                    >
                                        <div className="flex flex-col">
                                            <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50">
                                                Kết quả tìm kiếm
                                            </div>
                                            {searchResults.map((item: any) => {
                                                const price = item.variants?.[0]?.price || 0;
                                                const imageUrl = item.thumbnail_url 
                                                    ? (item.thumbnail_url.startsWith('http') ? item.thumbnail_url : `/storage/${item.thumbnail_url}`)
                                                    : 'https://via.placeholder.com/150';

                                                return (
                                                    <Link
                                                        key={item.id}
                                                        href={`/product/${item.id}`}
                                                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                                                    >
                                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-700">
                                                            <img src={imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{item.name}</h4>
                                                            <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 mt-1">
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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

                        {/* Compare Button */}
                        <Link href="/compare" className="relative p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all group">
                            <BarChart3 className="w-5 h-5 md:w-4 md:h-4 group-hover:text-indigo-600 transition-colors" />
                            {compareCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-purple-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-slate-50 dark:border-slate-950 animate-in zoom-in duration-300">
                                    {compareCount}
                                </span>
                            )}
                        </Link>

                        {/* Notification Bell - Tạm thời đã tắt */}

                        <Link href="/cart" className="relative p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all group">
                            <ShoppingCart className="w-5 h-5 md:w-4 md:h-4 group-hover:text-indigo-600 transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-slate-50 dark:border-slate-950 animate-in zoom-in duration-300">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* --- USER PROFILE / AUTH --- */}
                        {auth.user ? (
                            <UserDropdown user={auth.user} />
                        ) : (
                            <div className="flex items-center gap-2 pl-2">
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
                            className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden pointer-events-auto"
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

            {/* --- COMMAND PALETTE OVERLAY --- */}
            <AnimatePresence>
                {isCommandPaletteOpen && (
                    <div className="fixed inset-0 z-[200] overflow-y-auto p-4 md:p-20 flex items-start justify-center">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCommandPaletteOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col mt-10 md:mt-20"
                        >
                            {/* Search Header */}
                            <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm hành động hoặc gõ phím tắt..."
                                    className="w-full bg-transparent border-0 outline-none focus:ring-0 text-slate-800 dark:text-slate-100 font-medium text-sm p-0 placeholder:text-slate-400"
                                    value={paletteSearch}
                                    onChange={(e) => {
                                        setPaletteSearch(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    autoFocus
                                />
                                <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">ESC</span>
                            </div>

                            {/* Body (Filtered Commands List) */}
                            <div className="max-h-[300px] overflow-y-auto p-3 custom-scrollbar">
                                {filteredCommands.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredCommands.map((cmd: any, idx: number) => (
                                            <button
                                                key={cmd.id}
                                                onClick={() => handleExecuteCommand(cmd)}
                                                onMouseEnter={() => setSelectedIndex(idx)}
                                                className={cn(
                                                    "w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all font-medium text-xs md:text-sm group relative overflow-hidden",
                                                    selectedIndex === idx 
                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10" 
                                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 relative z-10">
                                                    <span className={cn(
                                                        "text-lg group-hover:scale-110 transition-transform duration-300",
                                                        selectedIndex === idx ? "text-white" : "text-indigo-600 dark:text-indigo-400"
                                                    )}>
                                                        {cmd.icon}
                                                    </span>
                                                    <span className="font-bold">{cmd.name}</span>
                                                </div>
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest relative z-10",
                                                    selectedIndex === idx ? "text-indigo-200" : "text-slate-400"
                                                )}>
                                                    {cmd.category}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                                        Không tìm thấy lệnh hoặc chức năng phù hợp.
                                    </div>
                                )}
                            </div>

                            {/* Footer hints */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex justify-between items-center px-6">
                                <span className="flex items-center gap-1">↑↓ để di chuyển</span>
                                <span className="flex items-center gap-1">ENTER để chọn</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { categories, auth } = usePage().props as any;
    const { getCompareCount } = useCompare();
    const compareCount = getCompareCount();

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
        <CartProvider>
            <LayoutContent
                children={children}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isScrolled={isScrolled}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearching}
                searchResults={searchResults}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                auth={auth}
                categories={categories}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                compareCount={compareCount}
            />
        </CartProvider>
    );
}
