import { useEffect, useState } from "react";
import AddGymModal from "../modals/addModals/gymModal";
import RegisterGymModal from "../modals/addModals/registerGymModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGyms } from "../../redux/gymSlice";
import { useNavigate } from "react-router-dom";

const GymsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { gyms, loading, error } = useSelector((state) => state.gym);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    const activeGyms = gyms.filter((gym) => gym.isActive !== false);
    const inactiveGyms = gyms.filter((gym) => gym.isActive === false);

    const filteredGyms = activeGyms.filter((gym) =>
        gym.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );

    const goGymDetail = (gym) => {
        navigate(`/admin/${gym.toLowerCase().replace(/\s+/g, "-")}`);
    };

    return (
        <div className="p-6 mx-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Spor Salonları</h1>
                <div className="flex items-center gap-2">
                    <button onClick={openAddModal} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Spor Salonu Ekle
                    </button>

                    <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-52" />
                </div>
            </div>

            {/* INACTIVE GYMS SECTION */}
            {inactiveGyms.length > 0 && (
                <div className="bg-red-50 border border-red-300 p-5 rounded-xl shadow">
                    <h2 className="text-xl font-semibold text-red-700 mb-4">Hesap Açılması Gereken Salonlar</h2>

                    <div className="space-y-3">
                        {inactiveGyms.map((gym) => (
                            <div key={gym.id} className="flex items-center justify-between bg-white border-red-300 border rounded-lg p-4 shadow hover:shadow-md transition">
                                <div>
                                    <p className="font-semibold text-gray-800">{gym.name}</p>
                                    <p className="text-sm text-gray-500">{gym.address}</p>
                                </div>

                                <button onClick={() => openRegisterModal(gym)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
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
                        {filteredGyms.map((gym) => (
                            <tr key={gym.id} onClick={() => goGymDetail(gym.name)} className="border-b hover:bg-gray-50 cursor-pointer transition" >
                                <td className="py-3 px-4">{gym.name}</td>
                                <td className="py-3 px-4">{gym.address}</td>
                                <td className="py-3 px-4">{gym.studentCount ?? 0}</td>
                            </tr>
                        ))}

                        {filteredGyms.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-6 text-gray-500">
                                    Hiç salon bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AddGymModal isOpen={addModalOpen} onClose={closeModal} />
            <RegisterGymModal gym={selectedGym} isOpen={registerModalOpen} onClose={closeRegisterModal} />
        </div>
    );
};

export default GymsTable;