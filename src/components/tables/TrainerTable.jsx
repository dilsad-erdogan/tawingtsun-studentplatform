import { useState } from "react";
import { updateUserRole } from "../../firebase/users";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/userSlice";
import { fetchAllTrainers } from "../../redux/trainerSlice";
import { addTrainers } from "../../firebase/trainers";

const TrainerTable = ({ trainers, users, gyms }) => {
    const dispatch = useDispatch();

    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedGymId, setSelectedGymId] = useState("");
    const [openTrainerId, setOpenTrainerId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [addModalOpen, setAddModalOpen] = useState(false);

    const toggleUser = (uid) => {
        setOpenTrainerId(openTrainerId === uid ? null : uid);
    };

    const filteredTrainers = trainers.filter((trainer) => {
        const user = users.find((u) => u.id === trainer.userId);
        return (
            user &&
            user.name.toLocaleLowerCase("tr").includes(
                searchTerm.trim().toLocaleLowerCase("tr")
            )
        );
    });

    const openAddModal = () => {
        setSelectedUserId("");
        setAddModalOpen(true);
    };

    const closeModal = () => {
        setAddModalOpen(false);
    };

    const handleSave = async () => {
        try {
            if (!selectedUserId) {
                alert("Lütfen bir kullanıcı ve salon seçin");
                return;
            }

            const newGym = {
                userId: selectedUserId,
                gymId: selectedGymId
            };

            await updateUserRole(selectedUserId);
            await addTrainers(newGym);
            dispatch(fetchAllUsers());
            dispatch(fetchAllTrainers());
            closeModal();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const groupedTrainers = filteredTrainers.reduce((acc, trainer) => {
        if (!acc[trainer.userId]) {
            acc[trainer.userId] = [];
        }
        acc[trainer.userId].push(trainer);
        return acc;
    }, {});
    
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Trainers</h1>
                <button onClick={() => openAddModal()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eğitimci Ekle</button>
                <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
            </div>
            
            <div className="space-y-2">
                {Object.entries(groupedTrainers).map(([userId, trainerList]) => {
                    const user = users.find((u) => u.id === userId);

                    return (
                        <div key={userId} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                            <button onClick={() => toggleUser(userId)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                                <span>
                                    {user ? `${user.name} (${user.email})` : userId}
                                </span>
                                <span>{openTrainerId === userId ? "▲" : "▼"}</span>
                            </button>

                            {openTrainerId === userId && (
                                <div className="px-4 py-3 bg-gray-50 text-sm">
                                    <p>
                                        <strong>Eğitim verdiği salonlar:</strong>{" "}
                                        {trainerList.map((trainer, index) => {
                                            const gym = gyms.find((g) => g.id === trainer.gymId);
                                            return (
                                                <span key={trainer.gymId}>
                                                    {gym ? gym.name : trainer.gymId}
                                                    {index < trainerList.length - 1 ? ", " : ""}
                                                </span>
                                            );
                                        })}
                                    </p>
                                    <p>
                                        <strong>Aylık toplam kazanç:</strong>{" "}
                                        {trainerList.reduce((sum, t) => sum + t.totalSalaryMonth, 0)}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {addModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">                    
                        <div className="flex justify-between mb-3">
                            <h2 className="text-xl font-semibold mb-4">Eğitimci Ekle</h2>
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                        </div>

                        <div className="space-y-3">
                            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full border p-2 rounded">
                                <option value="">Kullanıcı seç</option>
                                {users
                                    .filter((user) => user.role == "student")
                                    .map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="space-y-3 mt-5">
                            <select value={selectedGymId} onChange={(e) => setSelectedGymId(e.target.value)} className="w-full border p-2 rounded">
                                <option value="">Salon seç</option>
                                {gyms.map((gym) => (
                                        <option key={gym.id} value={gym.id}>{gym.name}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="flex justify-end mt-3">
                            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrainerTable