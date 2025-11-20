import { useEffect, useState } from "react";
import AddGymModal from "../modals/addModals/gymModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGyms } from "../../redux/gymSlice";

const GymsTable = () => {
    const dispatch = useDispatch();
    const { gyms, loading, error } = useSelector((state) => state.gym);

    const [openGymId, setOpenGymId] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleGym = (uid) => {
        setOpenGymId(openGymId === uid ? null : uid);
    };

    const closeModal = () => {
        setAddModalOpen(false);
    };

    const filteredGyms = gyms.filter((gym) =>
        gym.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );

    const openAddModal = () => {
        setAddModalOpen(true);
    };

    useEffect(() => {
        dispatch(fetchAllGyms());
    }, [dispatch]);
    
    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    

    return (
        <div className="p-6 mx-auto">
            <div className="flex justify-between items-center mb-4 gap-2">
                <h1 className="text-2xl font-bold mb-4">Gyms</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => openAddModal()} className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Spor Salonu Ekle</button>
                    <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
                </div>
            </div>

            <div className="space-y-2">
                {filteredGyms.map((gym) => {
                    return (
                        <div key={gym.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                            <button onClick={() => toggleGym(gym.id)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                                <span>{gym.name}</span>
                                <span>{openGymId === gym.id ? "▲" : "▼"}</span>
                            </button>

                            {openGymId === gym.id && (
                                <div className="px-4 py-3 bg-gray-50 text-sm">
                                    <p><strong>Address:</strong> {gym.address}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <AddGymModal isOpen={addModalOpen} onClose={closeModal} />
        </div>
    );
};

export default GymsTable;