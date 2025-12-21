import React from 'react';
import { useSelector } from 'react-redux';
import PaymentTable from './PaymentTable';

const PaymentSection = ({ gymId }) => {
    const { students } = useSelector((state) => state.student);

    // Filter students by gymId
    const gymStudents = students.filter(s => s.gymId === gymId);

    // Flatten all payments from all students in this gym
    const allPayments = gymStudents.flatMap(student =>
        (student.payments || []).map(payment => ({
            ...payment,
            studentId: student.id,
            studentName: student.name
        }))
    );

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // 1. Current Month Payments (Unpaid)
    const currentMonthPayments = allPayments.filter(payment => {
        if (payment.status === 'paid') return false;
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 2. Paid Payments
    const paidPayments = allPayments.filter(payment =>
        payment.status === 'paid'
    ).sort((a, b) => new Date(b.paidDate || b.date) - new Date(a.paidDate || a.date)); // Sort by paid date desc

    // 3. Future Payments (Unpaid)
    const futurePayments = allPayments.filter(payment => {
        if (payment.status === 'paid') return false;
        const paymentDate = new Date(payment.date);
        return paymentDate > currentDate && (paymentDate.getMonth() !== currentMonth || paymentDate.getFullYear() !== currentYear);
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate Total for Current Month
    const totalCurrentMonthAmount = currentMonthPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Ödeme Takibi</h2>
            <div className="flex flex-col lg:flex-row gap-6">
                <PaymentTable
                    title={`Bu Ayın Ödemeleri (Toplam: ${totalCurrentMonthAmount} ₺)`}
                    payments={currentMonthPayments}
                    showPayButton={true}
                />
                <PaymentTable
                    title="Ödenenler"
                    payments={paidPayments}
                    showPayButton={false}
                />
                <PaymentTable
                    title="Gelecek Ödemeler"
                    payments={futurePayments}
                    showPayButton={false}
                />
            </div>
        </div>
    );
};

export default PaymentSection;