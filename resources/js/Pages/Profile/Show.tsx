import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    User as UserIcon,
    Mail, Phone, MapPin, Settings, Package,
    Star, Clock, ChevronRight, ShieldCheck,
    Trophy, Zap, Crown, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileShowProps {
    user: any;
    ordersCount: number;
}

// ── Tier System Logic ──────────────────────────────────────────────────────────
// ── Ngưỡng tính theo tỉ lệ 1 điểm / 100.000đ
// VD: Laptop 15M → 150đ/đơn. Cần ~2 đơn lên Silver, ~6 lên Gold, ~14 lên Platinum
const TIERS = [
    {
        name: 'Bronze',
        label: 'Đồng',
        minPoints: 0,
        maxPoints: 299,
        color: 'from-amber-700 to-orange-600',
        bgColor: 'bg-amber-700/10',
        textColor: 'text-amber-600 dark:text-amber-500',
        borderColor: 'border-amber-600/30',
        icon: Award,
        benefit: 'Tích điểm mỗi đơn hàng',
        discount: '0%',
        ordersNeeded: '~2 đơn',
    },
    {
        name: 'Silver',
        label: 'Bạc',
        minPoints: 300,
        maxPoints: 799,
        color: 'from-slate-400 to-slate-500',
        bgColor: 'bg-slate-400/10',
        textColor: 'text-slate-500 dark:text-slate-300',
        borderColor: 'border-slate-400/30',
        icon: ShieldCheck,
        benefit: 'Giảm 2% mọi đơn hàng',
        discount: '2%',
        ordersNeeded: '~6 đơn',
    },
    {
        name: 'Gold',
        label: 'Vàng',
        minPoints: 800,
        maxPoints: 1999,
        color: 'from-yellow-400 to-amber-500',
        bgColor: 'bg-yellow-400/10',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        borderColor: 'border-yellow-400/30',
        icon: Trophy,
        benefit: 'Giảm 5% + ưu tiên hỗ trợ',
        discount: '5%',
        ordersNeeded: '~14 đơn',
    },
    {
        name: 'Platinum',
        label: 'Bạch kim',
        minPoints: 2000,
        maxPoints: Infinity,
        color: 'from-indigo-400 to-violet-500',
        bgColor: 'bg-indigo-400/10',
        textColor: 'text-indigo-500 dark:text-indigo-400',
        borderColor: 'border-indigo-400/30',
        icon: Crown,
        benefit: 'Giảm 10% + quà tặng VIP',
        discount: '10%',
        ordersNeeded: '20+ đơn',
    },
];

function getTierInfo(points: number) {
    const current = TIERS.findLast(t => points >= t.minPoints) || TIERS[0];
    const nextIndex = TIERS.indexOf(current) + 1;
    const next = nextIndex < TIERS.length ? TIERS[nextIndex] : null;

    const progressPercent = next
        ? Math.min(100, Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100))
        : 100;

    const pointsToNext = next ? next.minPoints - points : 0;

    return { current, next, progressPercent, pointsToNext };
}

export default function Show({ user, ordersCount }: ProfileShowProps) {
    const points = user.profile?.points || 0;
    const { current: tier, next: nextTier, progressPercent, pointsToNext } = getTierInfo(points);
    const TierIcon = tier.icon;

    return (
        <AppLayout>
            <Head title="Hồ sơ của tôi" />

            <div className="py-10 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* ── Profile Header Card ─────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden"
                    >
                        {/* Ambient glow */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/8 blur-[100px] -mr-36 -mt-36 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-600/8 blur-[80px] -ml-28 -mb-28 pointer-events-none" />

                        <div className="relative z-10 p-7 md:p-10">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7">

                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-xl">
                                        {user.profile?.avatar ? (
                                            <img
                                                src={`/storage/${user.profile.avatar}`}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                <UserIcon size={44} strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>
                                    {/* Tier badge on avatar */}
                                    <div className={`absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900`}>
                                        <TierIcon size={18} className="text-white" strokeWidth={2} />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center sm:text-left pt-2">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {user.name}
                                        </h1>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${tier.bgColor} ${tier.textColor} ${tier.borderColor}`}>
                                            <TierIcon size={11} className="mr-1.5" />
                                            {tier.label} Member
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap justify-center sm:justify-start gap-5 text-slate-500 dark:text-slate-400 mb-6">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail size={14} className="text-indigo-500" />
                                            <span className="font-medium">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock size={14} className="text-indigo-500" />
                                            <span className="font-medium">Tham gia {new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                        <Link
                                            href={route('profile.edit')}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
                                        >
                                            <Settings size={14} />
                                            Chỉnh sửa hồ sơ
                                        </Link>
                                        <Link
                                            href={route('orders.index')}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95 uppercase tracking-widest"
                                        >
                                            <Package size={14} />
                                            Đơn hàng của tôi
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Stats Row ────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Orders */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-indigo-200 dark:hover:border-indigo-500/20 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                                <Package size={24} strokeWidth={2} />
                            </div>
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{ordersCount}</span>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Đơn hàng đã đặt</span>
                        </motion.div>

                        {/* Points */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                            className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3 group-hover:scale-110 transition-transform">
                                <Star size={24} strokeWidth={2} />
                            </div>
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{points.toLocaleString()}</span>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Điểm tích lũy</span>
                        </motion.div>

                        {/* Tier */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.16 }}
                            className={`col-span-2 md:col-span-1 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border flex flex-col items-center text-center group hover:shadow-lg transition-all ${tier.borderColor} hover:${tier.borderColor}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl ${tier.bgColor} flex items-center justify-center ${tier.textColor} mb-3 group-hover:scale-110 transition-transform`}>
                                <TierIcon size={24} strokeWidth={2} />
                            </div>
                            <span className={`text-3xl font-black ${tier.textColor}`}>{tier.label}</span>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Hạng thành viên</span>
                        </motion.div>
                    </div>

                    {/* ── Membership Tier Card ─────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
                    >
                        {/* Header */}
                        <div className={`bg-gradient-to-r ${tier.color} p-6 relative overflow-hidden`}>
                            <div className="absolute inset-0 opacity-20">
                                <TierIcon className="absolute -right-6 -top-6 w-36 h-36 text-white rotate-12" strokeWidth={0.8} />
                            </div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-[11px] font-black uppercase tracking-widest mb-1">Hạng thành viên hiện tại</p>
                                    <h3 className="text-2xl font-black text-white">{tier.label.toUpperCase()}</h3>
                                    <p className="text-white/80 text-sm font-medium mt-1 flex items-center gap-1.5">
                                        <Zap size={13} />
                                        {tier.benefit}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/70 text-[11px] font-black uppercase tracking-widest mb-1">Giảm giá</p>
                                    <p className="text-3xl font-black text-white">{tier.discount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress to next tier */}
                        <div className="p-6">
                            {nextTier ? (
                                <>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <TierIcon size={14} className={tier.textColor} />
                                            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                {tier.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                {nextTier.label}
                                            </span>
                                            <nextTier.icon size={14} className={nextTier.textColor} />
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                                            className={`h-full bg-gradient-to-r ${tier.color} rounded-full relative`}
                                        >
                                            <div className="absolute inset-0 bg-white/20 rounded-full" />
                                        </motion.div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400">
                                            {points.toLocaleString()} / {nextTier.minPoints.toLocaleString()} điểm
                                        </span>
                                        <span className={`text-xs font-black ${nextTier.textColor} flex items-center gap-1`}>
                                            <Star size={11} />
                                            Còn {pointsToNext.toLocaleString()} điểm để lên {nextTier.label}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                /* Max tier */
                                <div className="flex items-center gap-3 py-2">
                                    <div className={`w-10 h-10 rounded-xl ${tier.bgColor} flex items-center justify-center ${tier.textColor}`}>
                                        <Crown size={20} />
                                    </div>
                                    <div>
                                        <p className={`font-black text-sm ${tier.textColor}`}>Bạn đã đạt hạng cao nhất!</p>
                                        <p className="text-xs text-slate-400 font-medium">Tận hưởng toàn bộ đặc quyền thành viên VIP</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* All tiers overview */}
                        <div className="px-6 pb-6">
                            <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Lộ trình thăng hạng</p>
                            <div className="grid grid-cols-4 gap-2">
                                {TIERS.map((t) => {
                                    const isCurrentTier = t.name === tier.name;
                                    const isPastTier = points >= t.minPoints;
                                    const TIcon = t.icon;
                                    return (
                                        <div
                                            key={t.name}
                                            className={`p-3 rounded-2xl border text-center transition-all ${
                                                isCurrentTier
                                                    ? `${t.bgColor} ${t.borderColor} shadow-sm`
                                                    : isPastTier
                                                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70'
                                                        : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/50 opacity-40'
                                            }`}
                                        >
                                            <TIcon size={16} className={`mx-auto mb-1.5 ${isCurrentTier ? t.textColor : 'text-slate-400'}`} strokeWidth={2} />
                                            <p className={`text-[10px] font-black ${isCurrentTier ? t.textColor : 'text-slate-400 dark:text-slate-500'}`}>
                                                {t.label}
                                            </p>
                                            <p className="text-[9px] text-slate-400 mt-0.5 font-medium">
                                                {t.maxPoints === Infinity ? `${t.minPoints.toLocaleString()}+` : `${t.minPoints}-${t.maxPoints}`}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Contact Details ──────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 }}
                        className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
                    >
                        <div className="px-7 py-5 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-black text-slate-900 dark:text-white">Chi tiết liên hệ</h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            <Link
                                href={route('profile.edit')}
                                className="flex items-center justify-between px-7 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Số điện thoại</p>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                            {user.profile?.phone || <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 dark:text-slate-700 group-hover:text-slate-500 transition-colors" />
                            </Link>

                            <Link
                                href={route('profile.edit')}
                                className="flex items-center justify-between px-7 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400 transition-colors">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Địa chỉ nhận hàng</p>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                            {user.profile?.address || <span className="text-slate-400 italic font-normal">Chưa cập nhật</span>}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 dark:text-slate-700 group-hover:text-slate-500 transition-colors" />
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </div>
        </AppLayout>
    );
}
