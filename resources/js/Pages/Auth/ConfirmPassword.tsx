import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Xác nhận mật khẩu" />

            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-650 dark:text-indigo-400 mx-auto mb-4">
                    <Lock size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Khu vực bảo mật</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Đây là khu vực yêu cầu tính bảo mật cao. Vui lòng nhập lại mật khẩu của bạn để xác thực trước khi tiếp tục.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                    <InputLabel htmlFor="password" value="Mật khẩu" className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <PrimaryButton className="w-full h-12 mt-6" disabled={processing}>
                    Xác nhận mật khẩu
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
