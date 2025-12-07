import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

const MonthlySection = () => {
    const { students } = useSelector((state) => state.student);
    const { gym } = useSelector((state) => state.gym);

    // Get current date info
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    // Calculate monthly revenue
    const monthlyData = useMemo(() => {
        const data = Array(12).fill(0);

        if (!students || !gym) return data;

        // Filter students for current gym
        const gymStudents = students.filter(s => s.gymId === gym.id);

        gymStudents.forEach(student => {
            if (student.payments) {
                student.payments.forEach(payment => {
                    // Only consider PAID payments
                    if (payment.status === 'paid' && payment.paidDate) {
                        const paidDate = new Date(payment.paidDate);

                        // Check if the payment was made in the current year
                        if (paidDate.getFullYear() === currentYear) {
                            const month = paidDate.getMonth();
                            const amount = Number(payment.amount) || Number(student.monthlySalary) || 0;
                            data[month] += amount;
                        }
                    }
                });
            }
        });

        return data;
    }, [students, gym, currentYear]);

    const maxRevenue = Math.max(...monthlyData, 1); // Avoid division by zero
    const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

    return (
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Yıllık Gelir Grafiği ({currentYear})</h2>

            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
                {monthlyData.map((amount, index) => {
                    // Scale to max 85% to leave room for text
                    const heightPercentage = (amount / maxRevenue) * 85;

                    // Determine color based on month
                    let barColorClass = "";
                    if (index < currentMonth) {
                        barColorClass = "bg-blue-900"; // Past: Darker
                    } else if (index === currentMonth) {
                        barColorClass = "bg-blue-600"; // Current: Distinct
                    } else {
                        barColorClass = "bg-blue-300"; // Future: Lighter
                    }

                    return (
                        <div key={index} className="flex flex-col items-center justify-end w-full h-full group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap z-10">
                                {amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                            </div>

                            {/* Bar */}
                            <div
                                className={`w-full rounded-t-sm transition-all duration-500 ${barColorClass} hover:opacity-80`}
                                style={{ height: `${Math.max(heightPercentage, 2)}%` }} // Min height 2% for visibility
                            ></div>

                            {/* Month Name */}
                            <span className="text-xs text-gray-500 mt-2 font-medium rotate-0 sm:rotate-0">
                                {monthNames[index]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthlySection;