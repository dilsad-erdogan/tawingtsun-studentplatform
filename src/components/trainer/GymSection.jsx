import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGymById } from "../../redux/gymSlice";
import PanelCards from "./PanelCards";

const GymSection = ({ gymId }) => {
    const dispatch = useDispatch();
    const { gym, loading: gymLoading } = useSelector((state) => state.gym);

    useEffect(() => {
        if (gymId) {
            dispatch(fetchGymById(gymId));
        }
    }, [dispatch, gymId]);

    if (gymLoading || !gym) {
        return <div className="p-4">Salon bilgileri yükleniyor...</div>;
    }

    return (
        <div className="p-4 space-y-6">
            {/* Salon Bilgileri */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{gym.name}</h2>
                <p className="text-gray-600">
                    <strong>Adres:</strong> {gym.address}
                </p>
            </div>

            {/* İstatistik Kartları */}
            <PanelCards gymId={gymId} />
        </div>
    );
};

export default GymSection;