import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { MailCheck } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Xác thực địa chỉ Email" />

            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                    <MailCheck size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Xác thực Email</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Cảm ơn bạn đã đăng ký! Trước khi bắt đầu, vui lòng nhấp vào liên kết xác thực chúng tôi vừa gửi đến địa chỉ email của bạn. Nếu không nhận được, hãy yêu cầu gửi một liên kết mới.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/25 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
                    Một liên kết xác thực mới đã được gửi đến địa chỉ email bạn cung cấp khi đăng ký.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <PrimaryButton className="w-full sm:w-auto h-12" disabled={processing}>
                        Gửi lại Email xác thực
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs font-black text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white hover:underline uppercase tracking-wider transition-colors active:scale-95 py-2"
                    >
                        Đăng xuất tài khoản
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
