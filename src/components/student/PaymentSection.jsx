import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PaymentModal from '../modals/PaymentModal';

const PaymentSection = () => {
    const { student } = useSelector((state) => state.student);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    if (!student) return null;

    const payments = student.payments || [];

    const filteredPayments = payments.filter(payment => {
        if (!startDate && !endDate) return true;
        const paymentDate = new Date(payment.date);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2100-01-01');
        return paymentDate >= start && paymentDate <= end;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Ödemeler</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Yeni Ödeme Planı
                </button>
            </div>

            <div className="flex gap-4 mb-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border-b">Tarih</th>
                            <th className="p-3 border-b">Açıklama</th>
                            <th className="p-3 border-b">Tutar</th>
                            <th className="p-3 border-b">Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-3 border-b">{new Date(payment.date).toLocaleDateString('tr-TR')}</td>
                                    <td className="p-3 border-b">{payment.description}</td>
                                    <td className="p-3 border-b">{payment.amount} ₺</td>
                                    <td className="p-3 border-b">
                                        {payment.status === 'paid' ? (
                                            <span className="text-green-600 font-semibold">Ödendi</span>
                                        ) : (
                                            <span className="text-yellow-600 font-semibold">Bekliyor</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center text-gray-500">Ödeme kaydı bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studentId={student.id}
            />
        </div>
    );
};

export default PaymentSection;