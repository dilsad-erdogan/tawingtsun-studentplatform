import { useState } from "react";
import { useDispatch } from "react-redux";
import { addGyms } from "../../firebase/gyms";
import { fetchAllGyms } from "../../redux/gymSlice";
import GymModal from "../modals/updateModals/gymModal";

const GymsTable = ({ gyms, users }) => {
    const dispatch = useDispatch();

    const [openGymId, setOpenGymId] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);
    const [formData, setFormData] = useState({ name: "", address: "" });

    const [searchTerm, setSearchTerm] = useState("");

    const toggleGym = (uid) => {
        setOpenGymId(openGymId === uid ? null : uid);
    };

    const openUpdateModal = (gym) => {
        setSelectedGym(gym);
        setUpdateModalOpen(true);
    };

    const closeModal = () => {
        setUpdateModalOpen(false);
        setAddModalOpen(false);
        setSelectedGym(null);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const getUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : "Bilinmiyor";
    };

    const filteredGyms = gyms.filter((gym) =>
        gym.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );

    const openAddModal = () => {
        setAddModalOpen(true);
    };

    const handleAddSave = async () => {
        try {
            const newUser = {
                name: formData.name,
                address: formData.address
            };
    
            const result = await addGyms(newUser);
            if (result) {
                console.log("Salon başarıyla eklendi:", result);
            }
    
            dispatch(fetchAllGyms());
            closeModal();
        } catch (error) {
            console.error("Add failed:", error);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Gyms</h1>
                <button onClick={() => openAddModal()} className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Spor Salonu Ekle</button>
                <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
            </div>
            
            <div className="space-y-2">
                {filteredGyms.map((gym) => (
                    <div key={gym.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                        <button onClick={() => toggleGym(gym.id)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                            <span>{gym.name}</span>
                            <span>{openGymId === gym.id ? "▲" : "▼"}</span>
                        </button>

                        {/* Details */}
                        {openGymId === gym.id && (
                            <div className="px-4 py-3 bg-gray-50 text-sm">
                                <p><strong>Address:</strong> {gym.address}</p>
                                <p><strong>Total Salary Month:</strong> {gym.totalSalaryMonth}</p>
                                <p>
                                    <strong>Own User:</strong>{" "}
                                    {Array.isArray(gym.ownUser) ? gym.ownUser.map(id => getUserName(id)).join(", ") : getUserName(gym.ownUser)}
                                </p>
                                <p>
                                    <strong>Trainers:</strong>{" "}
                                    {Array.isArray(gym.trainers) ? gym.trainers.map(id => getUserName(id)).join(", ") : getUserName(gym.trainers)}
                                </p>
                                <p>
                                    <strong>Students:</strong>{" "}
                                    {Array.isArray(gym.students) ? gym.students.map(id => getUserName(id)).join(", ") : getUserName(gym.students)}
                                </p>
                                <button onClick={() => openUpdateModal(gym)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Güncelle</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {addModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">                    
                        <div className="flex justify-between mb-3">
                            <h2 className="text-xl font-semibold mb-4">Salon Ekle</h2>
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                        </div>

                        <div className="space-y-3">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="İsim" className="w-full border p-2 rounded" />
                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adres" className="w-full border p-2 rounded" />
                        </div>

                        <div className="flex justify-end mt-3">
                            <button onClick={handleAddSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
                        </div>
                    </div>
                </div>
            )}

            <GymModal isOpen={updateModalOpen} onClose={closeModal} selectedGym={selectedGym} />
        </div>
    )
}

export default GymsTable;