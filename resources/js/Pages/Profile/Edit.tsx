import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { User, Camera, Mail, User as UserIcon, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Edit({ mustVerifyEmail, status }: ProfileProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const [preview, setPreview] = useState<string | null>(
        user.profile?.avatar ? `/storage/${user.profile.avatar}` : null
    );
    const fileInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: user.profile?.phone || '',
        address: user.profile?.address || '',
        avatar: null as File | null,
        _method: 'PATCH', // Cần thiết khi gửi form có File qua phương thức PATCH/PUT trong Laravel
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <AppLayout>
            <Head title="Hồ sơ cá nhân" />

            <div className="py-12 bg-slate-950 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Header Section */}
                    <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar Upload */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-600/30 bg-slate-800">
                                    {preview ? (
                                        <img src={preview} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                                            <UserIcon size={48} />
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => fileInput.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-700 transition-colors group"
                                >
                                    <Camera size={18} />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInput} 
                                    className="hidden" 
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                />
                            </div>

                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                                <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2">
                                    <Mail size={16} /> {user.email}
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 uppercase">
                                        {user.role}
                                    </span>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                                        {user.profile?.points || 0} Points
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
                                <header className="mb-8">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <ShieldCheck className="text-indigo-500" />
                                        Thông tin cơ bản
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Cập nhật thông tin định danh và liên lạc của bạn.
                                    </p>
                                </header>

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Họ và tên" />
                                            <TextInput
                                                id="name"
                                                className="mt-1 block w-full"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                                isFocused
                                                autoComplete="name"
                                            />
                                            <InputError className="mt-2" message={errors.name} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Địa chỉ Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                autoComplete="username"
                                            />
                                            <InputError className="mt-2" message={errors.email} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="phone" value="Số điện thoại" />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                                    <Phone size={16} />
                                                </div>
                                                <TextInput
                                                    id="phone"
                                                    className="mt-1 block w-full pl-11"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="09xx xxx xxx"
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>

                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="address" value="Địa chỉ nhận hàng" />
                                            <div className="relative">
                                                <div className="absolute top-4 left-4 text-slate-500">
                                                    <MapPin size={16} />
                                                </div>
                                                <textarea
                                                    id="address"
                                                    className="mt-1 block w-full bg-slate-800/50 border-2 border-slate-800 rounded-2xl py-3 px-5 pl-11 text-sm font-medium text-white focus:border-indigo-500 focus:bg-slate-800 transition-all outline-none min-h-[100px]"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    placeholder="Số nhà, tên đường, phường/xã..."
                                                />
                                            </div>
                                            <InputError className="mt-2" message={errors.address} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <PrimaryButton disabled={processing} className="w-full md:w-auto">
                                            <Save size={18} className="mr-2" />
                                            Lưu thay đổi
                                        </PrimaryButton>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-emerald-400 font-medium">Đã lưu thành công.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </section>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold mb-4">Hạng thành viên</h3>
                                    <div className="flex items-end gap-2 mb-6">
                                        <span className="text-4xl font-black">SILVER</span>
                                        <span className="text-indigo-200 text-sm mb-1">Cần 500 điểm để lên GOLD</span>
                                    </div>
                                    <div className="w-full bg-white/20 h-2 rounded-full mb-2">
                                        <div className="bg-white h-full rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                    <p className="text-xs text-indigo-100">Ưu đãi: Giảm 2% cho mọi đơn hàng</p>
                                </div>
                                <ShieldCheck className="absolute -bottom-8 -right-8 w-48 h-48 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                            </div>

                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                                <h3 className="text-white font-bold mb-4">Thông tin tài khoản</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">ID người dùng</span>
                                        <span className="text-slate-200 font-mono">#{user.id.toString().padStart(5, '0')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Ngày tham gia</span>
                                        <span className="text-slate-200">{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Trạng thái</span>
                                        <span className="text-emerald-400 font-bold">Hoạt động</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
