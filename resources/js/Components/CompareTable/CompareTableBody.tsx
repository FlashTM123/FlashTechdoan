import React from 'react';
import { getSpecNames, formatSpecName, CompareProductData } from '@/utils/compareUtils';
import { cn } from '@/lib/utils';

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
                    <td colSpan={products.length + 1} className="px-6 py-12 text-center bg-white dark:bg-slate-900/10">
                        <p className="text-slate-450 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                            {showOnlyDifferences
                                ? 'Không phát hiện điểm khác biệt giữa các dòng máy này'
                                : 'Không có thông số kỹ thuật'}
                        </p>
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {visibleSpecs.map((specName) => {
                const isDifferent = differenceSpecs.has(specName);
                const highlightClass = isDifferent
                    ? 'bg-purple-500/5 dark:bg-purple-950/20 border-l-4 border-purple-500/60'
                    : 'bg-white dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-850/10';

                return (
                    <tr key={specName} className={cn(highlightClass, "transition-colors duration-250")}>
                        {/* Spec Label */}
                        <td className="px-6 py-4 sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 font-bold text-slate-700 dark:text-slate-350 text-xs uppercase tracking-wider min-w-max border-r border-slate-100 dark:border-slate-800/80">
                            {formatSpecName(specName)}
                        </td>

                        {/* Spec Values */}
                        {products.map((product) => {
                            const variant = product.variants[0];
                            const value = variant?.details[specName] || '—';

                            return (
                                <td
                                    key={`${product.id}-${specName}`}
                                    className="px-6 py-4 text-center text-slate-700 dark:text-slate-300 text-xs font-medium"
                                >
                                    <span
                                        className={cn(
                                            "inline-block px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm",
                                            isDifferent 
                                                ? 'bg-purple-100/50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-500/20' 
                                                : 'bg-slate-100/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200/40 dark:border-slate-750'
                                        )}
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
