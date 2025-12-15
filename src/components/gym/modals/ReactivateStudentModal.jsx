import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStudent } from '../../../redux/studentSlice';

const ReactivateStudentModal = ({ isOpen, onClose, student }) => {
    const dispatch = useDispatch();
    const [studyPeriod, setStudyPeriod] = useState("");

    const handleSave = async () => {
        if (!studyPeriod || isNaN(studyPeriod) || Number(studyPeriod) <= 0) {
            alert("Lütfen geçerli bir süre giriniz.");
            return;
        }

        const updates = {
            isActive: true,
            date: new Date().toISOString(),
            studyPeriod: studyPeriod
        };

        await dispatch(updateStudent({
            studentId: student.id,
            updatedData: updates
        }));

        onClose();
        setStudyPeriod("");
    };

    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Öğrenciyi Aktifleştir</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600 mb-2">
                        <strong>{student.name}</strong> isimli öğrenciyi aktifleştirmek üzeresiniz.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        Kayıt tarihi bugünün tarihi olarak güncellenecektir.
                    </p>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yeni Öğrenim Süresi (Ay)
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={studyPeriod}
                        onChange={(e) => setStudyPeriod(e.target.value)}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="Örn: 3"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        Aktifleştir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReactivateStudentModal;
