import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

const GymComparison = () => {
    const { students } = useSelector((state) => state.student);
    const { gyms } = useSelector((state) => state.gym);

    const chartData = useMemo(() => {
        if (!gyms.length || !students.length) return [];

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const activeGyms = gyms.filter(gym => gym.isActive !== false);

        return activeGyms.map(gym => {
            const gymStudents = students.filter(s => s.gymId === gym.id);
            const activeCount = gymStudents.filter(s => s.isActive).length;

            const monthlyRevenue = gymStudents.reduce((total, student) => {
                const payments = student.payments || [];
                const studentMonthTotal = payments.reduce((pTotal, payment) => {
                    if (!payment.paidDate) return pTotal;

                    const pDate = new Date(payment.paidDate.seconds ? payment.paidDate.seconds * 1000 : payment.paidDate);

                    if (payment.status === 'paid' &&
                        pDate.getMonth() === currentMonth &&
                        pDate.getFullYear() === currentYear) {
                        return pTotal + Number(payment.amount);
                    }
                    return pTotal;
                }, 0);
                return total + studentMonthTotal;
            }, 0);

            return {
                name: gym.name,
                activeStudents: activeCount,
                revenue: monthlyRevenue
            };
        });
    }, [gyms, students]);

    if (!gyms.length) return null;

    return (
        <div className="bg-white p-10 rounded-xl shadow-md border border-gray-100 my-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-red-600" />
                Salon Bazlı Karşılaştırma
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Students Chart */}
                <div className="h-[500px]">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4 text-center">Aktif Öğrenci Sayıları</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280', angle: -90, textAnchor: 'end' }}
                                interval={0}
                                height={150}
                            />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f3f4f6' }}
                            />
                            <Bar dataKey="activeStudents" name="Aktif Öğrenci" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="h-[500px]">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4 text-center">Bu Ay Toplanan Ücretler (TL)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280', angle: -90, textAnchor: 'end' }}
                                interval={0}
                                height={150}
                            />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => `${value.toLocaleString('tr-TR')} ₺`}
                                cursor={{ fill: '#f3f4f6' }}
                            />
                            <Bar dataKey="revenue" name="Aylık Gelir" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default GymComparison;
