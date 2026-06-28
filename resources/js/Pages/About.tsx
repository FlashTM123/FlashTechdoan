import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, Shield, Award, Users, Target, Eye, Heart, Cpu } from 'lucide-react';

const stats = [
    { value: '2025', label: 'Năm thành lập' },
    { value: '10.000+', label: 'Khách hàng tin dùng' },
    { value: '500+', label: 'Mẫu laptop đang bán' },
    { value: '4.9★', label: 'Đánh giá trung bình' },
];

const values = [
    {
        icon: Shield,
        title: 'Uy tín – Chính hãng 100%',
        desc: 'Toàn bộ sản phẩm tại FlashTech đều có nguồn gốc rõ ràng, tem chính hãng và được nhập khẩu trực tiếp từ nhà sản xuất.',
        color: 'from-indigo-500 to-violet-600',
        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
        icon: Zap,
        title: 'Nhanh – Giao hàng tốc độ',
        desc: 'Đặt hàng trước 15:00, giao trong ngày tại nội thành. Miễn phí vận chuyển cho đơn từ 5 triệu đồng.',
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
        icon: Heart,
        title: 'Tận tâm – Hỗ trợ 24/7',
        desc: 'Đội ngũ kỹ thuật viên sẵn sàng tư vấn, hỗ trợ bảo hành và giải đáp mọi thắc mắc của bạn 24 giờ mỗi ngày.',
        color: 'from-rose-500 to-pink-600',
        bg: 'bg-rose-50 dark:bg-rose-950/30',
    },
    {
        icon: Award,
        title: 'Chất lượng – Bảo hành chặt chẽ',
        desc: 'Bảo hành chính hãng 12–36 tháng tùy sản phẩm. Đổi mới trong 7 ngày nếu lỗi do nhà sản xuất.',
        color: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
    }),
};

export default function About() {
    return (
        <AppLayout>
            <Head>
                <title>Về chúng tôi – FlashTech</title>
                <meta name="description" content="FlashTech – Hệ thống laptop chính hãng uy tín hàng đầu Việt Nam. Khám phá câu chuyện thành lập, sứ mệnh và giá trị cốt lõi của chúng tôi." />
            </Head>

            {/* ── HERO ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden rounded-3xl mb-16">
                {/* Gradient nền */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

                {/* Decorative blobs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-cyan-400/20 rounded-full blur-2xl" />

                <div className="relative z-10 px-8 md:px-16 py-20 md:py-28 text-white text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Cpu className="w-3.5 h-3.5" />
                        Thành lập từ năm 2025
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight"
                    >
                        Chúng tôi là<br />
                        <span className="text-cyan-300">FlashTech</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-white/80 text-base md:text-lg leading-relaxed"
                    >
                        Hệ thống bán lẻ laptop chính hãng hàng đầu Việt Nam — nơi công nghệ gặp gỡ niềm tin.
                        Chúng tôi không chỉ bán laptop, chúng tôi mang đến trải nghiệm mua sắm đỉnh cao.
                    </motion.p>
                </div>
            </section>

            {/* ── STATS ─────────────────────────────────────────────── */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 text-center shadow-sm"
                    >
                        <p className="text-3xl md:text-4xl font-black bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-1">
                            {stat.value}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </section>

            {/* ── SỨ MỆNH & TẦM NHÌN ───────────────────────────────── */}
            <section className="grid md:grid-cols-2 gap-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-10"
                >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-6">
                        <Target className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Sứ mệnh</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        FlashTech ra đời với sứ mệnh <strong className="text-indigo-600 dark:text-indigo-400">dân chủ hoá công nghệ</strong> —
                        giúp mọi người Việt Nam tiếp cận được những chiếc laptop chất lượng cao, chính hãng
                        với mức giá minh bạch và dịch vụ hậu mãi đáng tin cậy.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                        Chúng tôi tin rằng một chiếc laptop tốt không chỉ là công cụ làm việc —
                        đó là người bạn đồng hành giúp bạn chinh phục ước mơ.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-10"
                >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white mb-6">
                        <Eye className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Tầm nhìn</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Đến năm 2027, FlashTech hướng đến trở thành <strong className="text-cyan-600 dark:text-cyan-400">nền tảng mua sắm laptop số 1 Việt Nam</strong> —
                        với hệ sinh thái hoàn chỉnh từ tư vấn, mua hàng, bảo hành cho đến cộng đồng người dùng công nghệ.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                        Chúng tôi không ngừng đổi mới để mang lại trải nghiệm mua sắm
                        nhanh hơn, thông minh hơn và đáng tin cậy hơn cho khách hàng.
                    </p>
                </motion.div>
            </section>

            {/* ── GIÁ TRỊ CỐT LÕI ──────────────────────────────────── */}
            <section className="mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="inline-block text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-1.5 rounded-full mb-4">
                        Giá trị cốt lõi
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                        Chúng tôi cam kết điều gì?
                    </h2>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-5">
                    {values.map((v, i) => (
                        <motion.div
                            key={v.title}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className={`${v.bg} border border-slate-100 dark:border-slate-800/50 rounded-3xl p-7 flex gap-5 group hover:shadow-lg transition-shadow duration-300`}
                        >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <v.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white mb-2">{v.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-10 md:p-16 text-center"
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2),transparent_70%)]" />
                <div className="relative z-10">
                    <Users className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                        Hơn 10.000 khách hàng đã tin chọn FlashTech
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
                        Gia nhập cộng đồng người dùng FlashTech và trải nghiệm dịch vụ mua laptop chưa từng có.
                    </p>
                    <a
                        href="/products"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
                    >
                        Khám phá ngay
                    </a>
                </div>
            </motion.section>
        </AppLayout>
    );
}
