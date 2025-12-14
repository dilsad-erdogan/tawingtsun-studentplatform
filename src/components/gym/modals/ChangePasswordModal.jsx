import { useState } from 'react';
import { updatePassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import toast from 'react-hot-toast';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!newPassword || newPassword.length < 6) {
            toast.error("Şifre en az 6 karakter olmalıdır.");
            return;
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (user) {
                await updatePassword(user, newPassword);
                toast.success("Şifre başarıyla güncellendi!");
                onClose();
                setNewPassword("");
            } else {
                toast.error("Kullanıcı oturumu bulunamadı.");
            }
        } catch (error) {
            console.error("Password update error:", error);
            if (error.code === 'auth/requires-recent-login') {
                toast.error("Güvenlik nedeniyle lüften tekrar giriş yapıp deneyin.");
            } else {
                toast.error("Şifre güncellenirken hata oluştu.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold mb-4">Şifre Değiştir</h2>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">✕</button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="Yeni şifrenizi girin"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300 transition"
                    >
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordModal;
