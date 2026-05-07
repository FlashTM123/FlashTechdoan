import { useEffect, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, Laptop, CheckCircle2 } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
            <Head title="Đăng ký thành viên" />

            {/* LEFT SIDE: Visual Content */}
            <div className="hidden lg:block lg:w-[45%] relative bg-slate-900 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2000&auto=format&fit=crop" 
                    alt="Premium Tech"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-soft-light transform scale-110"
                />
                
                {/* Overlay content */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/80" />
                
                <div className="absolute top-1/2 -translate-y-1/2 left-16 right-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-5xl font-black text-white leading-tight mb-8 tracking-tighter">
                            Gia nhập cộng đồng <br /> <span className="text-indigo-500 italic">FlashTech ngay hôm nay.</span>
                        </h2>
                        
                        <div className="space-y-6">
                            {[
                                'Ưu đãi dành riêng cho thành viên',
                                'Theo dõi đơn hàng thời gian thực',
                                'Tích điểm đổi quà siêu hấp dẫn',
                                'Hỗ trợ kỹ thuật 24/7 từ chuyên gia'
                            ].map((text, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                                    <span className="text-slate-300 font-bold text-sm uppercase tracking-wider">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT SIDE: Register Form */}
            <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full mx-auto relative"
                >
                    {/* Logo Section */}
                    <Link href="/" className="inline-flex items-center gap-2.5 group mb-8">
                        <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg">
                            <Laptop className="w-6 h-6 text-white dark:text-slate-900" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                            Flash<span className="text-indigo-600">Tech</span>
                        </span>
                    </Link>

                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                        Tạo tài khoản mới
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                        Chỉ mất 30 giây để bắt đầu trải nghiệm mua sắm không giới hạn.
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Họ và tên</label>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ Email</label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu</label>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Xác nhận</label>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        <div className="py-2">
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                Bằng việc nhấn Đăng ký, bạn đã đồng ý với <Link href="#" className="text-indigo-600 font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link href="#" className="text-indigo-600 font-bold hover:underline">Chính sách bảo mật</Link> của chúng tôi.
                            </p>
                        </div>

                        <PrimaryButton className="w-full h-14 group" disabled={processing}>
                            <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Đăng ký ngay
                        </PrimaryButton>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-900 text-center">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Bạn đã có tài khoản?{' '}
                            <Link
                                href={route('login')}
                                className="text-indigo-600 dark:text-indigo-400 font-black hover:underline inline-flex items-center"
                            >
                                Đăng nhập tại đây
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
