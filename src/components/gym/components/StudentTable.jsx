import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddStudentModal from "../modals/AddStudentModal";

const StudentTable = ({ gymId }) => {
    const navigate = useNavigate();
    const { students } = useSelector((state) => state.student);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // Reset page when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-4 sm:p-6 mx-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
                <h1 className="text-2xl font-bold">Öğrenci Listesi</h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Öğrenci adına göre ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border px-3 py-2 rounded w-full sm:w-64"
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
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

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg overflow-hidden bg-white shadow">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Öğrenci Adı</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Telefon</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Grup</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Level</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Öğrenim Süresi</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Durum</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Kayıt Tarihi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((student) => {
                            const isPassive = !student.isActive;
                            const rowClass = `border-b hover:bg-gray-50 cursor-pointer transition ${isPassive ? "text-gray-400" : "text-gray-800"}`;

                            return (
                                <tr
                                    key={student.id}
                                    onClick={() => navigate(`/admin/student/${student.id}`)}
                                    className={rowClass}
                                >
                                    <td className="py-3 px-4 font-medium">{student.name}</td>
                                    <td className="py-3 px-4">{student.phone}</td>
                                    <td className="py-3 px-4">{student.group}</td>
                                    <td className="py-3 px-4">{student.level}</td>
                                    <td className="py-3 px-4">{student.studyPeriod}</td>
                                    <td className="py-3 px-4">
                                        {student.isActive ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Aktif</span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-semibold">Pasif</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {student.date ? new Date(student.date).toLocaleDateString("tr-TR") : "-"}
                                    </td>
                                </tr>
                            );
                        })}

                        {currentStudents.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    Bu salonda kayıtlı öğrenci bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages == 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        Önceki
                    </button>
                    <span className="text-gray-600">
                        Sayfa {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        Sonraki
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentTable;
