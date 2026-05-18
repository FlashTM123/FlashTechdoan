/**
 * Lấy danh sách các specs (tên attribute) có giá trị khác nhau giữa các sản phẩm
 */
export interface CompareProductData {
    id: number;
    name: string;
    thumbnail_url: string;
    price: number;
    variants: {
        id: number;
        variant_name: string;
        price: number;
        old_price: number;
        stock: number;
        sku: string;
        images: string[];
        details: Record<string, string>;
    }[];
}

export function getSpecNames(products: CompareProductData[]): string[] {
    if (products.length === 0) return [];

    // Get all spec keys from first variant of each product
    const specKeysSet = new Set<string>();

    products.forEach(product => {
        if (product.variants.length > 0) {
            const variant = product.variants[0];
            Object.keys(variant.details).forEach(key => {
                specKeysSet.add(key);
            });
        }
    });

    return Array.from(specKeysSet);
}

export function highlightDifferences(products: CompareProductData[]): Set<string> {
    const differenceSpecs = new Set<string>();

    if (products.length <= 1) {
        return differenceSpecs; // No differences if 1 or fewer products
    }

    // Get all spec names
    const specNames = getSpecNames(products);

    specNames.forEach(specName => {
        const values = new Set<string>();

        products.forEach(product => {
            if (product.variants.length > 0) {
                const variant = product.variants[0];
                const value = variant.details[specName] || '';
                values.add(value);
            }
        });

        // If more than 1 unique value, it's a difference
        if (values.size > 1) {
            differenceSpecs.add(specName);
        }
    });

    return differenceSpecs;
}

/**
 * Format Vietnamese attribute names to display friendly names
 */
export function formatSpecName(specName: string): string {
    const specMap: Record<string, string> = {
        cpu: 'CPU',
        ram: 'RAM',
        ssd: 'SSD',
        gpu: 'GPU',
        screen: 'Màn hình',
        battery: 'Pin',
        os: 'Hệ điều hành',
        weight: 'Trọng lượng',
        resolution: 'Độ phân giải',
        refresh_rate: 'Tần số quét',
        storage: 'Bộ nhớ',
        ports: 'Cổng kết nối',
        design: 'Thiết kế',
        keyboard: 'Bàn phím',
        trackpad: 'Touchpad',
        webcam: 'Webcam',
        speakers: 'Loa',
        audio: 'Âm thanh',
        connectivity: 'Kết nối',
        warranty: 'Bảo hành',
    };

    return specMap[specName] || specName.replace(/_/g, ' ').toUpperCase();
}

/**
 * Format price to Vietnamese currency
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(price);
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(price: number, oldPrice: number): number {
    if (oldPrice <= 0) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
}
