import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteGymAndAccount } from "../../../firebase/gyms";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import GymModal from "../modals/GymModal";

const GymSection = () => {
    const { gym, loading: gymLoading } = useSelector((state) => state.gym);
    const { data: user } = useSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const navigate = useNavigate();

    // Admin değilse şifre değiştirme butonunu göster
    const showPasswordButton = user && !user.isAdmin;

    const handleDelete = async () => {
        if (window.confirm("Bu salonu ve bağlı hesabı kalıcı olarak silmek istediğinizden emin misiniz?")) {
            const result = await deleteGymAndAccount(gym.id);
            if (result && result.success) {
                if (result.deletedSelf) {
                    // Kullanıcı kendini sildi, auth state listener yönlendirmesini bekleyebiliriz ama garanti olsun
                    window.location.reload();
                } else {
                    // Admin sildi
                    navigate("/admin");
                }
            }
        }
    };

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
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
                        >
                            Güncelle
                        </button>
                        {showPasswordButton && (
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                            >
                                Şifre Değiştir
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 text-center"
                        >
                            Sil
                        </button>
                    </div>
                </div>
            </div>

            <GymModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedGym={gym}
            />
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default GymSection;