import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import StudentModal from '../modals/StudentModal';

const StudentSection = () => {
    const { student, loading } = useSelector((state) => state.student);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) {
        return <div className="p-4">Öğrenci bilgileri yükleniyor...</div>;
    }

    if (!student) {
        return <div className="p-4">Öğrenci bulunamadı.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Öğrenci Bilgileri */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100 relative">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{student.name}</h2>
                        <div className="text-gray-600 space-y-1">
                            <p><strong>Telefon:</strong> {student.phone}</p>
                            <p><strong>Grup:</strong> {student.group}</p>
                            <p><strong>Seviye:</strong> {student.level}</p>
                            <p><strong>Çalışma Süresi:</strong> {student.studyPeriod} ay</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
                    >
                        Güncelle
                    </button>
                </div>
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedStudent={student}
            />
        </div>
    );
};

export default StudentSection;