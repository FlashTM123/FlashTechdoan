import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    User as UserIcon, 
    Mail, 
    Phone, 
    MapPin, 
    Settings, 
    Package, 
    Star, 
    Clock, 
    ChevronRight,
    ShieldCheck
} from 'lucide-react';

interface ProfileShowProps {
    user: any;
    ordersCount: number;
}

export default function Show({ user, ordersCount }: ProfileShowProps) {
    return (
        <AppLayout>
            <Head title="Hồ sơ của tôi" />

            <div className="py-12 bg-slate-950 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* PROFILE CARD HEADER */}
                    <div className="relative bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden mb-8">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 blur-[100px] -ml-32 -mb-32"></div>

                        <div className="relative z-10 p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Large Avatar */}
                                <div className="relative">
                                    <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-slate-800 bg-slate-800 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                        {user.profile?.avatar ? (
                                            <img 
                                                src={`/storage/${user.profile.avatar}`} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800">
                                                <UserIcon size={64} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-slate-900">
                                        <ShieldCheck size={24} />
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                        <h1 className="text-4xl font-black text-white tracking-tight">{user.name}</h1>
                                        <span className="inline-flex items-center px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase border border-indigo-500/20 tracking-widest">
                                            {user.role} Member
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Mail size={18} className="text-indigo-500" />
                                            <span className="text-sm font-medium">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={18} className="text-indigo-500" />
                                            <span className="text-sm font-medium">Tham gia {new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                                        <Link 
                                            href={route('profile.edit')}
                                            className="inline-flex items-center px-8 py-4 bg-white text-slate-950 text-sm font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                                        >
                                            <Settings size={18} className="mr-2" />
                                            Chỉnh sửa hồ sơ
                                        </Link>
                                        <Link
                                            href={route('orders.index')}
                                            className="inline-flex items-center px-8 py-4 bg-slate-800 text-white text-sm font-black rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 active:scale-95"
                                        >
                                            <Package size={18} className="mr-2" />
                                            Đơn hàng của tôi
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* STATS CARDS */}
                        <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 flex flex-col items-center text-center group hover:bg-slate-800/50 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                                <Package size={28} />
                            </div>
                            <span className="text-3xl font-black text-white mb-1">{ordersCount}</span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Đơn hàng đã đặt</span>
                        </div>

                        <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 flex flex-col items-center text-center group hover:bg-slate-800/50 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                                <Star size={28} />
                            </div>
                            <span className="text-3xl font-black text-white mb-1">{user.profile?.points || 0}</span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Điểm thưởng tích lũy</span>
                        </div>

                        <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 flex flex-col items-center text-center group hover:bg-slate-800/50 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={28} />
                            </div>
                            <span className="text-3xl font-black text-white mb-1">Silver</span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Hạng thành viên</span>
                        </div>
                    </div>

                    {/* DETAILS LIST */}
                    <div className="mt-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden">
                        <div className="p-8 border-b border-slate-800">
                            <h3 className="text-xl font-bold text-white">Chi tiết liên hệ</h3>
                        </div>
                        <div className="divide-y divide-slate-800">
                            <div className="p-8 flex items-center justify-between group hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Số điện thoại</p>
                                        <p className="text-lg font-medium text-white">{user.profile?.phone || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-700 group-hover:text-slate-500 transition-colors" />
                            </div>

                            <div className="p-8 flex items-center justify-between group hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Địa chỉ nhận hàng</p>
                                        <p className="text-lg font-medium text-white">{user.profile?.address || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-700 group-hover:text-slate-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
