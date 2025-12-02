import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { register } from "../../../firebase/login";
import { addAccount } from "../../../firebase/accounts";
import { updateGymActiveStatus } from "../../../firebase/gyms";

const RegisterGymModal = ({ gym, isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setEmail("");
            setPassword("");
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen || !gym) return null;

    const handleRegister = async () => {
        try {
            setLoading(true);

            const user = await register(email, password);
            if (!user) {
                setLoading(false);
                return;
            }

            const userId = user.uid;
            await addAccount({
                authId: userId,
                email: email,
                gymId: gym.id,
                isAdmin: false,
            });

            await updateGymActiveStatus(gym.id, true);
            setLoading(false);
            onClose();
        } catch (error) {
            console.error("Register Error:", error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-5 animate-scaleIn">
                <h2 className="text-xl font-bold text-gray-800">Salon Hesabı Oluştur</h2>

                <div className="bg-gray-100 p-4 rounded-lg border">
                    <p className="font-semibold text-gray-700">{gym.name}</p>
                    <p className="text-gray-500 text-sm">{gym.address}</p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded mt-1" placeholder="Salon e-posta adresi" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Şifre</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded mt-1" placeholder="Hesap şifresi" />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" disabled={loading} >
                        İptal
                    </button>

                    <button onClick={handleRegister} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" disabled={loading} >
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterGymModal;