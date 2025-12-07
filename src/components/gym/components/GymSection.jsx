import React, { useState } from "react";
import { useSelector } from "react-redux";
import GymModal from "../modals/GymModal";

const GymSection = () => {
    const { gym, loading: gymLoading } = useSelector((state) => state.gym);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (gymLoading || !gym) {
        return <div className="p-4">Salon bilgileri yükleniyor...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Salon Bilgileri */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{gym.name}</h2>
                        <p className="text-gray-600">
                            <strong>Adres:</strong> {gym.address}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
                    >
                        Güncelle
                    </button>
                </div>
            </div>

            <GymModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedGym={gym}
            />
        </div>
    );
};

export default GymSection;