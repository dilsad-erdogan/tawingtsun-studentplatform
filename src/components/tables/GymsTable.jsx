import { useState } from "react";
import GymModal from "../modals/updateModals/gymModal";
import AddGymModal from "../modals/addModals/gymModal";

const GymsTable = ({ gyms, users }) => {
    const [openGymId, setOpenGymId] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);
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

            <AddGymModal isOpen={addModalOpen} onClose={closeModal} />
            <GymModal isOpen={updateModalOpen} onClose={closeModal} selectedGym={selectedGym} />
        </div>
    )
}

export default GymsTable;