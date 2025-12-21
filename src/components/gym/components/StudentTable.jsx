import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddStudentModal from "../modals/AddStudentModal";
import ReactivateStudentModal from "../modals/ReactivateStudentModal";
import StudentReportModal from "../modals/StudentReportModal";

const StudentTable = ({ gymId }) => {
    const navigate = useNavigate();
    const { students } = useSelector((state) => state.student);
    const { data: user } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("Hepsi"); // Group Filter State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Reactivation Modal State
    const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
    const [selectedStudentForReactivate, setSelectedStudentForReactivate] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 1. Gym'e göre filtrele
    const gymStudents = students.filter((s) => s.gymId === gymId);

    // 2. Arama ve Grup filtresi
    const filteredStudents = gymStudents.filter((student) => {
        const matchesSearch = student.name?.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"));
        const matchesGroup = selectedGroup === "Hepsi" || student.group === selectedGroup;
        return matchesSearch && matchesGroup;
    });

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Helper to calculate remaining study months
    const calculateRemainingMonths = (student) => {
        if (!student.isActive || !student.date) return 0;

        const registrationDate = new Date(student.date);
        const currentDate = new Date();

        // Calculate difference in months
        const monthDiff = (currentDate.getFullYear() - registrationDate.getFullYear()) * 12 +
            (currentDate.getMonth() - registrationDate.getMonth());

        // Calculate remaining
        const remaining = student.studyPeriod - monthDiff;
        return Math.max(0, remaining);
    };

    // 3. Sıralama Logic
    const sortedStudents = React.useMemo(() => {
        let sortableStudents = [...filteredStudents];

        if (sortConfig.key) {
            sortableStudents.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Use calculated value for studyPeriod
                if (sortConfig.key === 'studyPeriod') {
                    aValue = calculateRemainingMonths(a);
                    bValue = calculateRemainingMonths(b);
                }

                // Handle string comparisons case-insensitively
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                // Handle undefined/null values
                if (aValue === undefined || aValue === null) return 1;
                if (bValue === undefined || bValue === null) return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else {
            // Default Sort: Ative first, then Date desc
            sortableStudents.sort((a, b) => {
                if (a.isActive !== b.isActive) {
                    return a.isActive ? -1 : 1;
                }
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });
        }
        return sortableStudents;
    }, [filteredStudents, sortConfig]);

    // Reset page when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <span className="ml-1 text-gray-400">↕</span>;
        return mapSortDirection(sortConfig.direction);
    };

    const mapSortDirection = (dir) => {
        return dir === 'asc' ? <span className="ml-1 text-blue-600">↑</span> : <span className="ml-1 text-blue-600">↓</span>;
    }

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
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="border px-3 py-2 rounded w-full sm:w-auto"
                    >
                        <option value="Hepsi">Hepsi</option>
                        <option value="Kadın">Kadın</option>
                        <option value="Erkek">Erkek</option>
                        <option value="Çocuk">Çocuk</option>
                        <option value="Özel">Özel</option>
                    </select>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
                    >
                        Öğrenci Ekle
                    </button>
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
                    >
                        Öğrenci Raporu Al
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
                            <th
                                className="py-3 px-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('name')}
                            >
                                Öğrenci Adı {renderSortIcon('name')}
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Telefon</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Grup</th>
                            <th
                                className="py-3 px-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('level')}
                            >
                                Seviye {renderSortIcon('level')}
                            </th>
                            <th
                                className="py-3 px-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('studyPeriod')}
                            >
                                Kalan Süre (Ay) {renderSortIcon('studyPeriod')}
                            </th>
                            <th
                                className="py-3 px-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('isActive')}
                            >
                                Durum {renderSortIcon('isActive')}
                            </th>
                            <th
                                className="py-3 px-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('date')}
                            >
                                Kayıt Tarihi {renderSortIcon('date')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((student) => {
                            const isPassive = !student.isActive;
                            const rowClass = `border-b hover:bg-gray-50 cursor-pointer transition ${isPassive ? "text-gray-400" : "text-gray-800"}`;

                            // Calculate remaining time for display
                            const remainingMonths = calculateRemainingMonths(student);

                            return (
                                <tr
                                    key={student.id}
                                    onClick={() => {
                                        const path = user?.isAdmin ? `/admin/student/${student.id}` : `/student/${student.id}`;
                                        navigate(path);
                                    }}
                                    className={rowClass}
                                >
                                    <td className="py-3 px-4 font-medium">{student.name}</td>
                                    <td className="py-3 px-4">{student.phone}</td>
                                    <td className="py-3 px-4">{student.group}</td>
                                    <td className="py-3 px-4">{student.level}</td>
                                    <td className="py-3 px-4">
                                        {!student.isActive ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedStudentForReactivate(student);
                                                    setIsReactivateModalOpen(true);
                                                }}
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition"
                                            >
                                                Aktifleştir
                                            </button>
                                        ) : (
                                            <span className={remainingMonths === 0 ? "text-red-500 font-bold" : ""}>
                                                {remainingMonths} Ay
                                            </span>
                                        )}
                                    </td>
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
            {totalPages > 1 && (
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

            <ReactivateStudentModal
                isOpen={isReactivateModalOpen}
                onClose={() => setIsReactivateModalOpen(false)}
                student={selectedStudentForReactivate}
            />
            <StudentReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                gymId={gymId}
            />
        </div>
    );
};

export default StudentTable;
