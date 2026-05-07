import { useEffect, FormEventHandler } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight, Laptop } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
            <Head title="Đăng nhập" />

            {/* LEFT SIDE: Login Form */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full mx-auto relative"
                >
                    {/* Logo Section */}
                    <Link href="/" className="inline-flex items-center gap-2.5 group mb-12">
                        <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg">
                            <Laptop className="w-6 h-6 text-white dark:text-slate-900" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                            Flash<span className="text-indigo-600">Tech</span>
                        </span>
                    </Link>

                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                        Chào mừng trở lại!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                        Tiếp tục hành trình săn lùng siêu phẩm Laptop cùng FlashTech.
                    </p>

                    {status && (
                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
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
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Mật khẩu</label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                )}
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center cursor-pointer group">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-3 text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">
                                    Duy trì đăng nhập
                                </span>
                            </label>
                        </div>

                        <PrimaryButton className="w-full h-14 group" disabled={processing}>
                            <LogIn className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                            Đăng nhập ngay
                        </PrimaryButton>
                    </form>

                    <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-900 text-center">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Bạn chưa có tài khoản?{' '}
                            <Link
                                href={route('register')}
                                className="text-indigo-600 dark:text-indigo-400 font-black hover:underline inline-flex items-center"
                            >
                                Đăng ký miễn phí
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT SIDE: Visual Content */}
            <div className="hidden lg:block lg:w-[55%] relative bg-slate-900 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=2000&auto=format&fit=crop" 
                    alt="Premium Tech"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-[10s] ease-linear"
                />
                
                {/* Overlay content */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-24 left-24 right-24">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px w-12 bg-indigo-500" />
                            <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">FlashTech Premium Experience</span>
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                            Đỉnh cao công nghệ <br /> <span className="text-indigo-500 italic">Trong tầm tay bạn.</span>
                        </h2>
                        <div className="flex gap-12">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white italic">5000+</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sản phẩm chính hãng</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white italic">24/7</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hỗ trợ chuyên nghiệp</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating UI Element */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-24 right-24 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic">FT</div>
                        <div>
                            <p className="text-white font-bold text-sm">Giao hàng siêu tốc</p>
                            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Nhận máy ngay trong ngày</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
