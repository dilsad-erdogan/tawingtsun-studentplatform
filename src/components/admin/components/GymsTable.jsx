import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchAllGyms } from "../../../redux/gymSlice";
import { getActiveStudentsCountByGymId } from "../../../firebase/students";

import AddGymModal from "../modals/GymModal";
import RegisterGymModal from "../modals/RegisterGymModal";

const GymsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { gyms, loading, error } = useSelector((state) => state.gym);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [studentCounts, setStudentCounts] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const closeModal = () => setAddModalOpen(false);
    const openAddModal = () => setAddModalOpen(true);

    const openRegisterModal = (gym) => {
        setSelectedGym(gym);
        setRegisterModalOpen(true);
    };

    const closeRegisterModal = () => {
        setRegisterModalOpen(false);
        setSelectedGym(null);
        dispatch(fetchAllGyms());
    };

    useEffect(() => {
        dispatch(fetchAllGyms());
    }, [dispatch]);

    const activeGyms = gyms.filter((gym) => gym.isActive !== false);

    useEffect(() => {
        const fetchCounts = async () => {
            const counts = {};
            for (const gym of activeGyms) {
                const count = await getActiveStudentsCountByGymId(gym.id);
                counts[gym.id] = count;
            }
            setStudentCounts(counts);
        };

        if (activeGyms.length > 0) {
            fetchCounts();
        }
    }, [activeGyms]);

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (loading) return <div className="p-4">Yükleniyor...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    const inactiveGyms = gyms.filter((gym) => gym.isActive === false);

    const filteredGyms = activeGyms.filter((gym) =>
        gym.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredGyms.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGyms = filteredGyms.slice(indexOfFirstItem, indexOfLastItem);

    const goGymDetail = (gym) => {
        navigate(`/admin/${gym.id}/${gym.name.toLowerCase().replace(/\s+/g, "-")}`);
    };

    return (
        <div className="p-4 sm:p-6 mx-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
                <h1 className="text-2xl font-bold">Spor Salonları</h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-2 rounded w-full sm:w-64" />
                    <button onClick={openAddModal} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center">
                        Spor Salonu Ekle
                    </button>
                </div>
            </div>

            {/* INACTIVE GYMS SECTION */}
            {inactiveGyms.length > 0 && (
                <div className="bg-red-50 border border-red-300 p-5 rounded-xl shadow mb-6">
                    <h2 className="text-xl font-semibold text-red-700 mb-4">Hesap Açılması Gereken Salonlar</h2>

                    <div className="space-y-3">
                        {inactiveGyms.map((gym) => (
                            <div key={gym.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border-red-300 border rounded-lg p-4 shadow hover:shadow-md transition gap-4 sm:gap-0">
                                <div>
                                    <p className="font-semibold text-gray-800">{gym.name}</p>
                                    <p className="text-sm text-gray-500">{gym.address}</p>
                                </div>

                                <button onClick={() => openRegisterModal(gym)} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center">
                                    Hesap Aç
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ACTIVE GYMS TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg overflow-hidden bg-white shadow">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Salon Adı</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Adres</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Öğrenci Sayısı</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentGyms.map((gym) => (
                            <tr key={gym.id} onClick={() => goGymDetail(gym)} className="border-b hover:bg-gray-50 cursor-pointer transition" >
                                <td className="py-3 px-4">{gym.name}</td>
                                <td className="py-3 px-4">{gym.address}</td>
                                <td className="py-3 px-4">{studentCounts[gym.id] ?? "..."}</td>
                            </tr>
                        ))}

                        {currentGyms.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-6 text-gray-500">
                                    Hiç salon bulunamadı.
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

            <AddGymModal isOpen={addModalOpen} onClose={closeModal} />
            <RegisterGymModal gym={selectedGym} isOpen={registerModalOpen} onClose={closeRegisterModal} />
        </div>
    );
};

export default GymsTable;