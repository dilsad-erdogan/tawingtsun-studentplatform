import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addPaymentPlan } from '../../../redux/studentSlice';

const PaymentModal = ({ isOpen, onClose, studentId }) => {
    const dispatch = useDispatch();
    const [totalAmount, setTotalAmount] = useState("");
    const [installmentCount, setInstallmentCount] = useState("");

    const handleSave = async () => {
        if (!totalAmount || !installmentCount) return;

        await dispatch(addPaymentPlan({
            studentId,
            totalAmount: Number(totalAmount),
            installmentCount: Number(installmentCount)
        }));
        onClose();
        setTotalAmount("");
        setInstallmentCount("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold mb-4">Yeni Ödeme Planı</h2>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Toplam Ücret</label>
                        <input
                            type="number"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="Örn: 12000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Taksit Sayısı (Max 12)</label>
                        <input
                            type="number"
                            value={installmentCount}
                            onChange={(e) => setInstallmentCount(e.target.value)}
                            className="w-full border p-2 rounded"
                            max={12}
                            placeholder="Örn: 12"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-3">
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
                </div>
            </div>
        </div>
    )
}

export default PaymentModal
