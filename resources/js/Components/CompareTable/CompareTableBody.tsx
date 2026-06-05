import React from 'react';
import { getSpecNames, formatSpecName, CompareProductData } from '@/utils/compareUtils';

interface CompareTableBodyProps {
    products: CompareProductData[];
    showOnlyDifferences: boolean;
    differenceSpecs: Set<string>;
}

export default function CompareTableBody({
    products,
    showOnlyDifferences,
    differenceSpecs,
}: CompareTableBodyProps) {
    const specNames = getSpecNames(products);

    // Filter specs based on "show only differences" toggle
    const visibleSpecs = showOnlyDifferences
        ? specNames.filter(spec => differenceSpecs.has(spec))
        : specNames;

    if (visibleSpecs.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={products.length + 1} className="px-6 py-8 text-center">
                        <p className="text-slate-400">
                            {showOnlyDifferences
                                ? 'Không có điểm khác biệt giữa các sản phẩm'
                                : 'Không có thông số kỹ thuật'}
                        </p>
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="divide-y divide-slate-700">
            {visibleSpecs.map((specName) => {
                const isDifferent = differenceSpecs.has(specName);
                const highlightClass = isDifferent
                    ? 'bg-purple-950/40 border-l-4 border-purple-500/50'
                    : 'bg-slate-800/30';

                return (
                    <tr key={specName} className={`${highlightClass} transition`}>
                        {/* Spec Label */}
                        <td className="px-6 py-4 sticky left-0 bg-slate-900 z-10 font-semibold text-slate-300 text-sm min-w-max">
                            {formatSpecName(specName)}
                        </td>

                        {/* Spec Values */}
                        {products.map((product) => {
                            const variant = product.variants[0];
                            const value = variant?.details[specName] || '—';

                            return (
                                <td
                                    key={`${product.id}-${specName}`}
                                    className="px-6 py-4 text-center text-slate-300 text-sm"
                                >
                                    <span
                                        className={`
                                            inline-block px-3 py-2 rounded-md
                                            ${isDifferent ? 'bg-purple-500/20 text-purple-200' : 'bg-slate-700/40'}
                                        `}
                                    >
                                        {value}
                                    </span>
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}
