import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { AlertTriangle, ShieldAlert, Trash2 } from 'lucide-react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            {/* Header cảnh báo */}
            <div className="flex items-start gap-4 p-5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-2xl">
                <div className="flex-shrink-0 w-10 h-10 bg-rose-100 dark:bg-rose-900/50 rounded-xl flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                    <h2 className="text-base font-black text-rose-800 dark:text-rose-300 mb-1">
                        Xóa tài khoản vĩnh viễn
                    </h2>
                    <p className="text-sm text-rose-700 dark:text-rose-400 leading-relaxed">
                        Sau khi xóa, toàn bộ dữ liệu cá nhân, lịch sử mua hàng và thông tin tài khoản của bạn
                        sẽ bị xóa <strong>vĩnh viễn</strong> và không thể khôi phục.
                    </p>
                    <p className="text-sm text-rose-600 dark:text-rose-500 mt-2 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Lưu ý: Bạn không thể xóa tài khoản khi còn đơn hàng đang được xử lý.
                    </p>
                </div>
            </div>

            <DangerButton
                onClick={confirmUserDeletion}
                className="flex items-center gap-2"
            >
                <Trash2 className="w-4 h-4" />
                Xóa tài khoản của tôi
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-7">
                    {/* Modal header */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center flex-shrink-0">
                            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 dark:text-white">
                                Xác nhận xóa tài khoản?
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Hành động này không thể hoàn tác.
                            </p>
                        </div>
                    </div>

                    {/* Cảnh báo trong modal */}
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl mb-5">
                        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                            Toàn bộ dữ liệu của bạn — bao gồm thông tin cá nhân, địa chỉ, lịch sử đơn hàng —
                            sẽ bị xóa <strong>vĩnh viễn</strong>. Vui lòng chắc chắn trước khi tiếp tục.
                        </p>
                    </div>

                    {/* Nhập mật khẩu xác nhận */}
                    <div className="mb-2">
                        <InputLabel htmlFor="password" value="Nhập mật khẩu để xác nhận" className="font-bold text-gray-700 dark:text-gray-300 mb-2" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full"
                            isFocused
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} type="button">
                            Hủy bỏ
                        </SecondaryButton>
                        <DangerButton disabled={processing} className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            {processing ? 'Đang xóa...' : 'Xóa tài khoản'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
