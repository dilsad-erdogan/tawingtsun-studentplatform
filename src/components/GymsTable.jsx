import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateGymByID } from "../firebase/gyms";
import { fetchAllGyms } from "../redux/gymSlice";

const GymsTable = ({ gyms }) => {
    const dispatch = useDispatch();

    const [openGymId, setOpenGymId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);
    const [formData, setFormData] = useState({ name: "", address: "", totalSalaryMonth: 0, students: [], ownUser: [], trainers: [] });

    const toggleGym = (uid) => {
        setOpenGymId(openGymId === uid ? null : uid);
    };

    const openModal = (gym) => {
        setSelectedGym(gym);
        setFormData({
            name: gym.name,
            address: gym.address
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedGym(null);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            await updateGymByID(selectedGym.id, formData);
            dispatch(fetchAllGyms());
            closeModal();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gyms</h1>
            <div className="space-y-2">
                {gyms.map((gym) => (
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
                                <p><strong>Own User:</strong> {gym.ownUser}</p>
                                <p><strong>Trainers:</strong> {gym.trainers}</p>
                                <p><strong>Students:</strong> {gym.students}</p>
                                <button onClick={() => openModal(gym)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Güncelle</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between mb-3">
                            <h2 className="text-xl font-semibold mb-4">Spor salonunu Güncelle</h2>
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                        </div>

                        <div className="space-y-3">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Salon ismi" className="w-full border p-2 rounded" />
                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adres" className="w-full border p-2 rounded" />
                        </div>

                        <div className="flex justify-end mt-3">
                            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
                        </div>

                        {/* <div className="mt-6 border-t pt-4">
                            <h3 className="text-lg font-semibold mb-2">Ödeme Ekle</h3>
                            <input type="number" name="salary" value={formData.salary || ""} onChange={handleChange} placeholder="Ücret" className="w-full border p-2 rounded" />
                            <div className="flex justify-end mt-3">
                                <button onClick={() => handleAddPayment(selectedUser.id)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ekle</button>
                            </div>
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    )
}

export default GymsTable