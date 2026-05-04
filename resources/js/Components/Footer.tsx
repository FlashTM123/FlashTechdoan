import { Link } from "@inertiajs/react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-1">
                    <h2 className="text-2xl font-bold text-indigo-600 mb-6">FlashTech</h2>
                    <p className="text-slate-500 leading-relaxed">
                        Chuyên cung cấp các dòng laptop chính hãng, uy tín hàng đầu Việt Nam.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-800 uppercase text-sm tracking-widest">Sản phẩm</h4>
                    <ul className="space-y-4 text-slate-500">
                        <li><a href="#" className="hover:text-indigo-600 transition">Laptop Gaming</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition">MacBook</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition">Laptop Văn phòng</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-800 uppercase text-sm tracking-widest">Hỗ trợ</h4>
                    <ul className="space-y-4 text-slate-500">
                        <li><a href="#" className="hover:text-indigo-600 transition">Chính sách bảo hành</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition">Vận chuyển</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition">Liên hệ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-slate-800 uppercase text-sm tracking-widest">Newsletter</h4>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email của bạn" className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Gửi</button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
                © {new Date().getFullYear()} FlashTech. Designed for Graduation Project.
            </div>
        </footer>
    );
}
