import { useEffect, useState } from "react";
import AddGymModal from "../modals/addModals/gymModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGyms } from "../../redux/gymSlice";
import { useNavigate } from "react-router-dom";

const GymsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { gyms, loading, error } = useSelector((state) => state.gym);
    const user = useSelector((state) => state.user.data);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const closeModal = () => setAddModalOpen(false);
    const openAddModal = () => setAddModalOpen(true);

    useEffect(() => {
        dispatch(fetchAllGyms());
    }, [dispatch]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    const filteredGyms = gyms.filter((gym) =>
        gym.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );

    const goGymDetail = (gymId) => {
        navigate(`/admin/${user.authId}/gym/${gymId}`);
    };

    return (
        <div className="p-6 mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Spor Salonları</h1>
                <div className="flex items-center gap-2">
                    <button onClick={openAddModal} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Spor Salonu Ekle
                    </button>

                    <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-52" />
                </div>
            </div>

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
                            <tr key={gym.id} onClick={() => goGymDetail(gym.id)} className="border-b hover:bg-gray-50 cursor-pointer transition" >
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
        </div>
    );
};

export default GymsTable;