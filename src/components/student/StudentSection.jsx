import React from 'react';
import { useSelector } from 'react-redux';

const StudentSection = () => {
    const { student, loading } = useSelector((state) => state.student);

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
                            <p><strong>Çalışma Süresi:</strong> {student.studyPeriod}</p>
                        </div>
                    </div>
                    {/* Buraya güncelle butonu veya başka aksiyonlar eklenebilir */}
                </div>
            </div>
        </div>
    );
};

export default StudentSection;