import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

interface CartItem {
    variant_id: number;
    name: string;
    variant_name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface AppliedCoupon {
    coupon_code: string;
    type: "percent" | "fixed";
    value: number;
    discount_amount: number;
    final_total: number;
}

interface CartContextType {
    cart: CartItem[];
    totalPrice: number;
    appliedCoupon: AppliedCoupon | null;
    setAppliedCoupon: React.Dispatch<React.SetStateAction<AppliedCoupon | null>>;
    finalTotal: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (variant_id: number) => void;
    updateQuantity: (variant_id: number, quantity: number) => void;
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { auth } = usePage().props as any;

    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('flash_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Coupon state — persist in sessionStorage so it survives navigation to Checkout
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
        const saved = sessionStorage.getItem('flash_coupon');
        return saved ? JSON.parse(saved) : null;
    });

    const totalPrice = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    // Recalculate discount whenever cart total changes (e.g. user removes items)
    const finalTotal = useMemo(() => {
        if (!appliedCoupon) return totalPrice;
        if (appliedCoupon.type === 'percent') {
            const discount = Math.min((appliedCoupon.value / 100) * totalPrice, totalPrice);
            return Math.max(0, totalPrice - discount);
        }
        return Math.max(0, totalPrice - appliedCoupon.value);
    }, [totalPrice, appliedCoupon]);

    // Persist coupon to sessionStorage
    useEffect(() => {
        if (appliedCoupon) {
            sessionStorage.setItem('flash_coupon', JSON.stringify(appliedCoupon));
        } else {
            sessionStorage.removeItem('flash_coupon');
        }
    }, [appliedCoupon]);

    // Logic đồng bộ
    const syncCart = async () => {
        if (auth.user) {
            try {
                const localCart = localStorage.getItem('flash_cart');
                if (localCart) {
                    const items = JSON.parse(localCart);
                    if (items.length > 0) {
                        // Đồng bộ lên server
                        await axios.post(route('cart.sync'), {
                            items: items.map((i: any) => ({
                                variant_id: i.variant_id,
                                quantity: i.quantity
                            }))
                        });
                        localStorage.removeItem('flash_cart');
                    }
                }

                // Lấy dữ liệu từ DB và CHUẨN HÓA (Mapping)
                const response = await axios.get(route('cart.data'));
                const normalizedCart = response.data.map((item: any) => ({
                    name: item.variant.product.name,
                    variant_id: item.product_variant_id,
                    variant_name: item.variant.variant_name,
                    price: Number(item.variant.price),
                    image: item.variant.images?.[0]?.image_url
                            ? (item.variant.images[0].image_url.startsWith('http')
                                ? item.variant.images[0].image_url
                                : `/storage/${item.variant.images[0].image_url}`)
                            : (item.variant.product.thumbnail_url?.startsWith('http')
                                ? item.variant.product.thumbnail_url
                                : `/storage/${item.variant.product.thumbnail_url}`),
                    quantity: item.quantity
                }));

                setCart(normalizedCart);
            } catch (error) {
                console.error("Lỗi đồng bộ giỏ hàng:", error);
            }
        }
    };

    // Chạy sync mỗi khi user thay đổi (đăng nhập/đăng xuất)
    useEffect(() => {
        syncCart();
    }, [auth.user]);

    // Lưu LocalStorage khi cart thay đổi (chỉ khi CHƯA đăng nhập)
    useEffect(() => {
        if (!auth.user) {
            localStorage.setItem('flash_cart', JSON.stringify(cart));
        }
    }, [cart, auth.user]);

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            const exists = prev.find(i => i.variant_id === item.variant_id);
            let newCart;
            if (exists) {
                newCart = prev.map(i => i.variant_id === item.variant_id
                    ? { ...i, quantity: i.quantity + item.quantity } : i);
            } else {
                newCart = [...prev, item];
            }
            return newCart;
        });

        // Nếu đã đăng nhập, gọi API để lưu vào DB luôn
        if (auth.user) {
            axios.post(route('cart.sync'), {
                items: [{ variant_id: item.variant_id, quantity: item.quantity }]
            });
        }
    };

    const removeFromCart = (variant_id: number) => {
        setCart(prev => prev.filter(item => item.variant_id !== variant_id));

        if (auth.user) {
            axios.post(route('cart.sync'), {
                items: [{ variant_id, quantity: 0 }]
            });
        }
    };

    const updateQuantity = (variant_id: number, quantity: number) => {
        if (quantity < 1) return;

        setCart(prev => prev.map(item =>
            item.variant_id === variant_id ? { ...item, quantity } : item
        ));

        if (auth.user) {
            axios.post(route('cart.sync'), {
                items: [{ variant_id, quantity }]
            });
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            totalPrice,
            appliedCoupon,
            setAppliedCoupon,
            finalTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            setCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
