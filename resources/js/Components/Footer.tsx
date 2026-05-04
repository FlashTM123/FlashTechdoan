import { Link } from "@inertiajs/react";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-1">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 font-display tracking-tight">FlashTech</h2>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                        Chuyên cung cấp các dòng laptop chính hãng, uy tín hàng đầu Việt Nam.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-800 dark:text-slate-200 uppercase text-xs tracking-[0.2em]">Sản phẩm</h4>
                    <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Laptop Gaming</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">MacBook</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Laptop Văn phòng</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-800 dark:text-slate-200 uppercase text-xs tracking-[0.2em]">Hỗ trợ</h4>
                    <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Chính sách bảo hành</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Vận chuyển</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Liên hệ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-800 dark:text-slate-200 uppercase text-xs tracking-[0.2em]">Newsletter</h4>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email của bạn" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" />
                        <button className="bg-indigo-600 dark:bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-bold text-sm">Gửi</button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-xs tracking-wide">
                © {new Date().getFullYear()} FlashTech. Designed for Graduation Project.
            </div>
        </footer>
    );
}
