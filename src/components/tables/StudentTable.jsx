import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddStudentModal from "../modals/addModals/AddStudentModal";

const StudentTable = ({ gymId }) => {
    const navigate = useNavigate();
    const { students } = useSelector((state) => state.student);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Gym'e göre filtrele
    const gymStudents = students.filter((s) => s.gymId === gymId);

    // 2. Arama filtresi
    const filteredStudents = gymStudents.filter((student) =>
        student.name?.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );

    // 3. Sıralama: Aktifler üstte, Pasifler altta
    const sortedStudents = filteredStudents.sort((a, b) => {
        if (a.isActive === b.isActive) return 0;
        return a.isActive ? -1 : 1;
    });

    return (
        <div className="p-4 bg-white shadow rounded-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Öğrenci Listesi</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Öğrenci adına göre ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border px-3 py-2 rounded w-full sm:w-64"
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition whitespace-nowrap"
                    >
                        Öğrenci Ekle
                    </button>
                </div>
            </div>

            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                gymId={gymId}
            />

            {sortedStudents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Bu salonda kayıtlı öğrenci bulunamadı.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="border-b px-4 py-3 font-semibold text-gray-600">Öğrenci Adı</th>
                                <th className="border-b px-4 py-3 font-semibold text-gray-600">Telefon</th>
                                <th className="border-b px-4 py-3 font-semibold text-gray-600">Grup</th>
                                <th className="border-b px-4 py-3 font-semibold text-gray-600">Level</th>
                                <th className="border-b px-4 py-3 font-semibold text-gray-600">Öğrenim Süresi</th>
                                <th className="border-b px-4 py-3 font-semibold text-gray-600">Durum</th>
                                <th className="border-b px-4 py-3 font-semibold text-gray-600">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStudents.map((student) => {
                                const isPassive = !student.isActive;
                                const rowClass = `border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition ${isPassive ? "text-gray-400" : "text-gray-800"}`;

                                return (
                                    <tr
                                        key={student.id}
                                        onClick={() => navigate(`/admin/student/${student.id}`)}
                                        className={rowClass}
                                    >
                                        <td className="px-4 py-3 font-medium">{student.name}</td>
                                        <td className="px-4 py-3">{student.phone}</td>
                                        <td className="px-4 py-3">{student.group}</td>
                                        <td className="px-4 py-3">{student.level}</td>
                                        <td className="px-4 py-3">{student.studyPeriod}</td>
                                        <td className="px-4 py-3">
                                            {student.isActive ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Aktif</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-semibold">Pasif</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {student.date ? new Date(student.date).toLocaleDateString("tr-TR") : "-"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentTable;
