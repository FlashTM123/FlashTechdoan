import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Swal from 'sweetalert2';

interface CompareContextType {
    compareList: number[];
    addToCompare: (variantId: number) => void;
    removeFromCompare: (variantId: number) => void;
    isInCompare: (variantId: number) => boolean;
    getCompareCount: () => number;
    clearCompare: () => void;
}

export const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
    const [compareList, setCompareList] = useState<number[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('flash_compare');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // Persist to localStorage whenever compareList changes
    useEffect(() => {
        localStorage.setItem('flash_compare', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (variantId: number) => {
        setCompareList(prev => {
            // Already in list
            if (prev.includes(variantId)) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sản phẩm đã có trong danh sách',
                    text: 'Sản phẩm này đã có trong danh sách so sánh của bạn.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b82f6',
                });
                return prev;
            }

            // Maximum 3 products
            if (prev.length >= 3) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Không thể thêm sản phẩm',
                    text: 'Bạn chỉ có thể so sánh tối đa 3 sản phẩm. Vui lòng xóa một sản phẩm trước khi thêm sản phẩm khác.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                });
                return prev;
            }

            // Add to list
            const newList = [...prev, variantId];
            Swal.fire({
                icon: 'success',
                title: 'Thêm vào danh sách so sánh',
                text: 'Sản phẩm đã được thêm vào danh sách so sánh.',
                timer: 1500,
                showConfirmButton: false,
            });
            return newList;
        });
    };

    const removeFromCompare = (variantId: number) => {
        setCompareList(prev => prev.filter(id => id !== variantId));
    };

    const isInCompare = (variantId: number): boolean => {
        return compareList.includes(variantId);
    };

    const getCompareCount = (): number => {
        return compareList.length;
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    return (
        <CompareContext.Provider
            value={{
                compareList,
                addToCompare,
                removeFromCompare,
                isInCompare,
                getCompareCount,
                clearCompare,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
};
