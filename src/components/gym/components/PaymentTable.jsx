import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStudentPayment } from '../../../redux/studentSlice';

const PaymentTable = ({ title, payments, showPayButton }) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(payments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);

    const handleMarkAsPaid = async (studentId, paymentId) => {
        if (window.confirm("Bu ödemeyi ödendi olarak işaretlemek istediğinize emin misiniz?")) {
            await dispatch(updateStudentPayment({
                studentId,
                paymentId,
                updates: {
                    status: 'paid',
                    paidDate: new Date().toISOString()
                }
            }));
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 border border-gray-100 flex-1 min-w-[300px]">
            <h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-2 border-b">Öğrenci</th>
                            <th className="p-2 border-b">Tarih</th>
                            <th className="p-2 border-b">Tutar</th>
                            {showPayButton && <th className="p-2 border-b">İşlem</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentPayments.length > 0 ? (
                            currentPayments.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-2 border-b font-medium">{item.studentName}</td>
                                    <td className="p-2 border-b">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                                    <td className="p-2 border-b">{item.amount} ₺</td>
                                    {showPayButton && (
                                        <td className="p-2 border-b">
                                            <button
                                                onClick={() => handleMarkAsPaid(item.studentId, item.id)}
                                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                            >
                                                Ödendi
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={showPayButton ? 4 : 3} className="p-3 text-center text-gray-500">
                                    Kayıt bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-3 text-xs">
                <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                >
                    Önceki
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
};

export default PaymentTable;
