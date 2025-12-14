import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteStudent } from '../../../firebase/students';
import { updateStudent } from '../../../redux/studentSlice';
import StudentModal from '../modals/StudentModal';

const StudentSection = () => {
    const { student, loading } = useSelector((state) => state.student);
    const { gym } = useSelector((state) => state.gym); // Redirect için gym bilgisi lazım olabilir
    const { data: user } = useSelector((state) => state.user);

    // Check if user is admin based on Redux state
    const isAdmin = user?.isAdmin || false;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToggleStatus = async () => {
        const action = student.isActive ? "pasife çekmek" : "aktifleştirmek";
        if (window.confirm(`${student.name} öğrencisini ${action} istediğinize emin misiniz?`)) {
            await dispatch(updateStudent({
                studentId: student.id,
                updatedData: { isActive: !student.isActive }
            }));
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`${student.name} öğrencisini kalıcı olarak silmek istediğinize emin misiniz?`)) {
            const success = await deleteStudent(student.id);
            if (success) {
                // Yönlendirme mantığı:
                // Admin ise -> /admin/gymId/gymName (eğer context varsa) veya /admin
                // Trainer ise -> /gymId/gymName
                navigate(-1); // En basit ve güvenli yöntem, geldiği yere geri gönder
            }
        }
    };

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                            {student.isActive ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    Aktif
                                </span>
                            ) : (
                                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-semibold">
                                    Pasif
                                </span>
                            )}
                        </div>
                        <div className="text-gray-600 space-y-1">
                            <p><strong>Telefon:</strong> {student.phone}</p>
                            <p><strong>Grup:</strong> {student.group}</p>
                            <p><strong>Seviye:</strong> {student.level}</p>
                            <p><strong>Çalışma Süresi:</strong> {student.studyPeriod} ay</p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
                        >
                            Güncelle
                        </button>
                        <button
                            onClick={handleToggleStatus}
                            className={`w-full sm:w-auto px-4 py-2 text-white rounded text-center ${student.isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {student.isActive ? 'Pasife Çek' : 'Aktifleştir'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 text-center"
                        >
                            Sil
                        </button>
                    </div>
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