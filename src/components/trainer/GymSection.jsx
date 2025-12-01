import React from "react";
import { useSelector } from "react-redux";

const GymSection = () => {
    const { gym, loading: gymLoading } = useSelector((state) => state.gym);

    if (gymLoading || !gym) {
        return <div className="p-4">Salon bilgileri yükleniyor...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Salon Bilgileri */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{gym.name}</h2>
                <p className="text-gray-600">
                    <strong>Adres:</strong> {gym.address}
                </p>
            </div>
        </div>
    );
};

export default GymSection;