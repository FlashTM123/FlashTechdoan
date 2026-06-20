import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Quên mật khẩu" />

            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                    <KeyRound size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Quên mật khẩu?</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Đừng lo lắng! Hãy nhập địa chỉ email của bạn, chúng tôi sẽ gửi liên kết để bạn tự đặt lại mật khẩu mới.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Địa chỉ Email" className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full"
                        placeholder="your-email@example.com"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <PrimaryButton className="w-full h-12 mt-4" disabled={processing}>
                    Gửi mã đặt lại mật khẩu
                </PrimaryButton>

                <div className="text-center mt-6">
                    <Link
                        href={route('login')}
                        className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
                    >
                        <ArrowLeft size={14} />
                        Quay lại Đăng nhập
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
