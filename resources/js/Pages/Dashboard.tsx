import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DollarSign, ShoppingCart, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data cho biểu đồ
const categoryData = [
    { name: 'Gaming', value: 45 },
    { name: 'Văn phòng', value: 32 },
    { name: 'Thiết kế', value: 28 },
    { name: 'Học tập', value: 52 },
    { name: 'Lập trình', value: 38 },
    { name: 'Khác', value: 15 },
];

// Component Stat Card
const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`rounded-lg ${color} p-3 text-white`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    </div>
);

export default function Dashboard() {
    // Mock data thống kê
    const totalRevenue = '₫125,450,000';
    const totalOrders = 1245;
    const totalCustomers = 856;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* SECTION 1: STAT CARDS */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                        <StatCard
                            icon={DollarSign}
                            title="Tổng doanh thu"
                            value={totalRevenue}
                            color="bg-indigo-600"
                        />
                        <StatCard
                            icon={ShoppingCart}
                            title="Tổng số đơn hàng"
                            value={totalOrders.toLocaleString('vi-VN')}
                            color="bg-green-600"
                        />
                        <StatCard
                            icon={Users}
                            title="Tổng số khách hàng"
                            value={totalCustomers.toLocaleString('vi-VN')}
                            color="bg-blue-600"
                        />
                    </div>

                    {/* SECTION 2: CHART */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-6 text-lg font-semibold text-gray-800">
                                Cơ cấu Laptop theo Danh mục
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis
                                        allowDecimals={false}
                                        label={{ value: 'Số lượng', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#4f46e5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
