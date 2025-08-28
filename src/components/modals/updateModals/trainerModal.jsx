import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const TrainerModal = ({ isOpen, onClose, selectedTrainer, allGyms }) => {
    const [newGymId, setNewGymId] = useState("");

    const userId = selectedTrainer[0]?.userId;

    const currentGyms = selectedTrainer.map((t) => t.gymId);
    const availableGyms = allGyms.filter((gym) => !currentGyms.includes(gym.id));

    const handleDeleteGym = (gymId) => {
        console.log("Silinecek gym:", gymId);
        // burada backend çağrısı yapacaksın
    };

    const handleAddGym = () => {
        if (!newGymId) return;
        console.log("Eklenecek gym:", newGymId);
        // burada backend çağrısı yapacaksın
        setNewGymId("");
    };

    const handleRemoveTrainer = () => {
        console.log("Tüm trainer kayıtları silinecek, userId:", userId);
        // burada backend çağrısı yapacaksın
    };

    if (!isOpen || !selectedTrainer) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
                <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold">Kullanıcıyı Güncelle</h2>
                    <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">X</button>
                </div>

                <p className="font-mono text-sm mb-2">User ID: {userId}</p>
                <hr className="my-3" />

                <div className="space-y-2 mb-3">
                    <p className="font-medium">Eğitim Verdiği Salonlar:</p>
                    {currentGyms.map((gymId) => (
                        <div key={gymId} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <span>{gymId}</span>
                            <button onClick={() => handleDeleteGym(gymId)} className="text-red-600 hover:text-red-800">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

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
                                {gym.name} ({gym.id})
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