import { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, Lock, LogOut, ChevronDown, ShieldCheck, ShoppingCart } from 'lucide-react';

interface Props {
    user: any;
}

export default function UserDropdown({ user }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300 group"
            >
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20 transform group-hover:scale-105 transition-all duration-300">
                    {user.profile?.avatar ? (
                        <img 
                            src={`/storage/${user.profile.avatar}`} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        user.name.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="hidden md:flex flex-col items-start text-left px-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        {user.name}
                    </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 z-[120]"
                    >
                        <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden backdrop-blur-xl">
                            {/* User Header Info (Small screens/Quick view) */}
                            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tài khoản</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.email}</p>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                                <Link 
                                    href={route('profile.show')}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    Thông tin tài khoản
                                </Link>

                                <Link 
                                    href="/cart" 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <ShoppingCart className="w-4 h-4" />
                                    </div>
                                    Giỏ hàng của tôi
                                </Link>

                                <Link 
                                    href={route('orders.index')} 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                    Đơn hàng của tôi
                                </Link>

                                <Link 
                                    href={route('profile.edit')} // Assuming Breeze's profile edit
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    Đổi mật khẩu
                                </Link>

                            </div>

                            {/* Logout Section */}
                            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </div>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
