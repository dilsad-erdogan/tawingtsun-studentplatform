import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { addTrainers, deleteAllTrainersByUser, deleteTrainerByUserAndGym } from "../../../firebase/trainers";
import { updateUserRole } from "../../../firebase/users";
import { useDispatch } from "react-redux";
import { fetchAllTrainers } from "../../../redux/trainerSlice";
import { fetchAllUsers } from "../../../redux/userSlice";

const TrainerModal = ({ isOpen, onClose, selectedTrainer, allGyms, users }) => {
    const [newGymId, setNewGymId] = useState("");
    const dispatch = useDispatch();

    if (!isOpen || !selectedTrainer || selectedTrainer.length === 0) return null;

    const userId = selectedTrainer[0]?.userId;
    const currentGyms = selectedTrainer.map((t) => t.gymId);
    const availableGyms = allGyms.filter((gym) => !currentGyms.includes(gym.id));

    const handleDeleteGym = async (gymId) => {
        const success = await deleteTrainerByUserAndGym(userId, gymId);
        if (success) {
            console.log("Trainer kaydı silindi:", gymId);
            dispatch(fetchAllTrainers());
            onClose();
        }
    };

    const handleAddGym = async () => {
        if (!newGymId || !userId) {
            alert("Lütfen bir kullanıcı ve salon seçin!");
            return;
        }

        const newGym = {
            userId: userId,
            gymId: newGymId
        };

        const result = await addTrainers(newGym);

        if (result) {
            dispatch(fetchAllTrainers());
            setNewGymId("");
            onClose();
        }
    };

    const handleRemoveTrainer = async () => {
        const success = await deleteAllTrainersByUser(userId);
        await updateUserRole(userId, "student");
        if (success) {
            dispatch(fetchAllTrainers());
            dispatch(fetchAllUsers());
            onClose();
        }
    };

    const userName = users.find((u) => u.id === userId)?.name || "Bilinmiyor";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
                <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold">Kullanıcıyı Güncelle</h2>
                    <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">X</button>
                </div>

                <p className="font-mono text-sm mb-2">Kullanıcı: {userName}</p>
                <hr className="my-3" />

                <div className="space-y-2 mb-3">
                    <p className="font-medium">Eğitim Verdiği Salonlar:</p>
                    {currentGyms.map((gymId) => {
                        const gymName = allGyms.find((g) => g.id === gymId)?.name || "Bilinmiyor";
                        return (
                            <div key={gymId} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                <span>{gymName}</span>
                                <button onClick={() => handleDeleteGym(gymId)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}

                    {currentGyms.length === 0 && (
                        <p className="text-gray-500 text-sm">Henüz salon eklenmemiş.</p>
                    )}
                </div>
                <hr className="my-3" />

                <div className="items-center mb-3">
                    <select value={newGymId} onChange={(e) => setNewGymId(e.target.value)} className="w-full border p-2 rounded">
                        <option value="">Salon seç...</option>
                        {availableGyms.map((gym) => (
                            <option key={gym.id} value={gym.id}>
                                {gym.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddGym} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Ekle
                    </button>
                </div>

                <hr className="my-3" />

                {/* Traineri Kaldır */}
                <div className="flex justify-end">
                    <button onClick={handleRemoveTrainer} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Traineri Kaldır
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainerModal;