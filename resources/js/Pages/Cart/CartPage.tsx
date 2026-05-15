import React from 'react';
import { useCart } from '../../Context/CartContext';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const CartPage: React.FC = () => {
    const { cart, totalPrice, removeFromCart, updateQuantity } = useCart();

    return (
        <AppLayout>
            <Head title="Giỏ hàng - FlashTech" />
            
            <div className="min-h-[70vh] py-12">
                {cart.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 px-4 text-center"
                    >
                        <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8 shadow-inner">
                            <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700" strokeWidth={1} />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 font-display">Giỏ hàng của bạn đang trống</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 text-lg font-medium">
                            Có vẻ như bạn chưa chọn được chiếc laptop ưng ý nào. Hãy quay lại cửa hàng để khám phá thêm nhé!
                        </p>
                        <Link 
                            href="/" 
                            className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                            Tiếp tục mua sắm
                        </Link>
                    </motion.div>
                ) : (
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight">Giỏ hàng <span className="text-indigo-600">.</span></h1>
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{cart.length} sản phẩm</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                            {/* DANH SÁCH SẢN PHẨM */}
                            <div className="lg:col-span-2 space-y-6">
                                {cart.map((item, index) => (
                                    <motion.div 
                                        key={item.variant_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] flex flex-col sm:items-center sm:flex-row gap-8 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none"
                                    >
                                        <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-xl" />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.variant_name}</p>
                                            
                                            <div className="pt-4 flex items-center gap-6">
                                                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-200/50 dark:border-slate-700">
                                                    <button 
                                                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-slate-900 dark:text-white">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.variant_id)}
                                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right sm:pl-8">
                                            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">
                                                {(item.price * item.quantity).toLocaleString()}đ
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Đơn giá: {item.price.toLocaleString()}đ</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* TỔNG KẾT ĐƠN HÀNG */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900 dark:bg-slate-900/80 p-8 md:p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-900/20 border border-indigo-500/10 sticky top-32"
                            >
                                <h2 className="text-2xl font-black mb-8 font-display tracking-tight flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-indigo-400" />
                                    Thanh toán
                                </h2>
                                
                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between text-slate-400 font-bold text-sm">
                                        <span className="uppercase tracking-widest">Tạm tính</span>
                                        <span className="text-white">{totalPrice.toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 font-bold text-sm border-b border-slate-800 pb-5">
                                        <span className="uppercase tracking-widest">Vận chuyển</span>
                                        <span className="text-emerald-400 uppercase tracking-widest text-[10px]">Miễn phí</span>
                                    </div>
                                    <div className="flex justify-between text-3xl font-black font-display pt-2">
                                        <span>Tổng số</span>
                                        <span className="text-indigo-400">{totalPrice.toLocaleString()}đ</span>
                                    </div>
                                </div>

                                <Link 
                                    href="/checkout" 
                                    className="w-full py-5 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white transition-all duration-300 rounded-2xl font-black text-lg shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Tiến hành thanh toán
                                </Link>
                                
                                <p className="text-center text-slate-500 text-[10px] font-bold mt-6 uppercase tracking-widest leading-loose">
                                    Miễn phí hoàn trả trong 30 ngày <br />
                                    Bảo mật thông tin thanh toán 100%
                                </p>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default CartPage;
