import AppLayout from "@/Layouts/AppLayout";
import ProductCard from "@/Components/ProductCard";
import { Head} from "@inertiajs/react";

export default function Products({ products }: { products: any[] }) {
    return (
        <AppLayout>
            <Head title="Tất cả sản phẩm" />
            <div className="py-10">
                <h1 className="text-4xl font-black text-slate-900 mb-10 font-display">Tất cả sản phẩm</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
