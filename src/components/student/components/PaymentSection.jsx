import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, ArrowRight, X } from 'lucide-react';

import PaymentModal from '../modals/PaymentModal';
import { updateStudentPayment, updateStudent, deleteStudentPayment } from '../../../redux/studentSlice';

const PaymentSection = () => {
    const { student } = useSelector((state) => state.student);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // New state
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [editDate, setEditDate] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Auto-fix missing IDs
    useEffect(() => {
        if (student?.payments?.some(p => !p.id)) {
            const fixedPayments = student.payments.map(p => ({
                ...p,
                id: p.id || crypto.randomUUID()
            }));
            dispatch(updateStudent({
                studentId: student.id,
                updatedData: { payments: fixedPayments }
            }));
        }
    }, [student, dispatch]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [startDate, endDate]);

    if (!student) return null;

    const payments = student.payments || [];

    const filteredPayments = payments.filter(payment => {
        if (!startDate && !endDate) return true;
        const paymentDate = new Date(payment.date);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2100-01-01');
        return paymentDate >= start && paymentDate <= end;
    }).sort((a, b) => {
        // First sort by status (pending first, paid last)
        if (a.status === 'paid' && b.status !== 'paid') return 1;
        if (a.status !== 'paid' && b.status === 'paid') return -1;

        // Then sort by date
        return new Date(a.date) - new Date(b.date);
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

    const handleEditClick = (payment) => {
        setEditingPaymentId(payment.id);
        setEditAmount(payment.amount);
        // Ensure date is in YYYY-MM-DD format for input
        const dateStr = payment.date ? new Date(payment.date).toISOString().split('T')[0] : "";
        setEditDate(dateStr);
    };

    const handleCancelClick = () => {
        setEditingPaymentId(null);
        setEditAmount("");
        setEditDate("");
    };

    const handleSaveClick = async (paymentId) => {
        await dispatch(updateStudentPayment({
            studentId: student.id,
            paymentId,
            updates: {
                amount: Number(editAmount),
                date: new Date(editDate).toISOString()
            }
        }));
        setEditingPaymentId(null);
        setEditAmount("");
        setEditDate("");
    };

    const handleMarkAsPaidClick = async (paymentId) => {
        if (window.confirm("Bu ödemeyi ödendi olarak işaretlemek istediğinize emin misiniz?")) {
            await dispatch(updateStudentPayment({
                studentId: student.id,
                paymentId,
                updates: {
                    status: 'paid',
                    paidDate: new Date().toISOString()
                }
            }));
        }
    };

    const handleDeleteClick = async (paymentId) => {
        if (window.confirm("Bu ödemeyi silmek istediğinize emin misiniz?")) {
            await dispatch(deleteStudentPayment({
                studentId: student.id,
                paymentId
            }));
        }
    };

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


            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100 items-end">
                <div className="flex-1 w-full sm:min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Başlangıç Tarihi</label>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={18} />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        />
                    </div>
                </div>

                <div className="hidden sm:flex items-center justify-center pb-3 text-gray-400">
                    <ArrowRight size={20} />
                </div>

                <div className="flex-1 w-full sm:min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Bitiş Tarihi</label>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={18} />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        />
                    </div>
                </div>

                {(startDate || endDate) && (
                    <button
                        onClick={() => { setStartDate(""); setEndDate(""); }}
                        className="mb-2 px-3 py-1 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1 border border-red-200"
                    >
                        <X size={14} /> Temizle
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border-b">Tarih</th>
                            <th className="p-3 border-b">Açıklama</th>
                            <th className="p-3 border-b">Tutar</th>
                            <th className="p-3 border-b">Durum</th>
                            <th className="p-3 border-b">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPayments.length > 0 ? (
                            currentPayments.map((payment, index) => (
                                <tr key={index} className={`hover:bg-gray-50 ${payment.status === 'paid' ? 'bg-gray-50 opacity-75' : ''}`}>
                                    <td className="p-3 border-b">
                                        {editingPaymentId === payment.id ? (
                                            <input
                                                type="date"
                                                value={editDate}
                                                onChange={(e) => setEditDate(e.target.value)}
                                                className="border p-1 rounded w-32"
                                            />
                                        ) : (
                                            new Date(payment.date).toLocaleDateString('tr-TR')
                                        )}
                                    </td>
                                    <td className="p-3 border-b">{payment.description}</td>
                                    <td className="p-3 border-b">
                                        {editingPaymentId === payment.id ? (
                                            <input
                                                type="number"
                                                value={editAmount}
                                                onChange={(e) => setEditAmount(e.target.value)}
                                                className="border p-1 rounded w-24"
                                            />
                                        ) : (
                                            `${payment.amount} ₺`
                                        )}
                                    </td>
                                    <td className="p-3 border-b">
                                        {payment.status === 'paid' ? (
                                            <span className="text-green-600 font-semibold">Ödendi</span>
                                        ) : (
                                            <span className="text-yellow-600 font-semibold">Bekliyor</span>
                                        )}
                                    </td>
                                    <td className="p-3 border-b">
                                        <div className="flex gap-2">
                                            {editingPaymentId === payment.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveClick(payment.id)}
                                                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                                                    >
                                                        Kaydet
                                                    </button>
                                                    <button
                                                        onClick={handleCancelClick}
                                                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                                    >
                                                        İptal
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {payment.status !== 'paid' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditClick(payment)}
                                                                className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                                                            >
                                                                Düzenle
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkAsPaidClick(payment.id)}
                                                                className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                                                            >
                                                                Ödendi İşaretle
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(payment.id)}
                                                                className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                                                            >
                                                                Sil
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-3 text-center text-gray-500">Ödeme kaydı bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                    Önceki
                </button>
                <span className="text-gray-600">Sayfa {currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                    Sonraki
                </button>
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