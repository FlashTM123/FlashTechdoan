import React from 'react';
import { useCompare } from '@/hooks/useCompare';
import { BarChart3 } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface CompareButtonProps {
    productId: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showBadge?: boolean;
}

export default function CompareButton({
    productId,
    className = '',
    size = 'md',
    showBadge = false,
}: CompareButtonProps) {
    const { addToCompare, isInCompare, getCompareCount } = useCompare();

    const isComparing = isInCompare(productId);
    const compareCount = getCompareCount();

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'flex-1 py-6 text-lg font-black',
    };

    const buttonClass = isComparing
        ? 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-500'
        : 'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600';

    return (
        <div className="relative">
            <button
                onClick={() => addToCompare(productId)}
                className={`
                    ${sizeClasses[size]}
                    ${buttonClass}
                    rounded-lg font-medium transition flex items-center gap-2
                    ${size === 'lg' ? 'rounded-[2rem]' : ''}
                    ${className}
                `}
                title={isComparing ? 'Đang so sánh' : 'Thêm vào danh sách so sánh'}
            >
                <BarChart3 className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
                {size !== 'sm' && <span>So sánh</span>}
            </button>

            {/* Badge showing compare count */}
            {showBadge && compareCount > 0 && (
                <Link
                    href={route('compare.index')}
                    className="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition"
                >
                    {compareCount}
                </Link>
            )}
        </div>
    );
}

