import { useEffect } from "react";
import { useState } from "react";
import { updateUserByUID } from "../../firebase/users";
import { clearUser, fetchAllUsers } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { logout } from "../../firebase/login";
import { useNavigate } from "react-router-dom";

const UserModal = ({ isOpen, onClose, user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", weight: 0, height: 0 });

    useEffect(() => {
        if (user) {
          setFormData({ name: user.name || "", email: user.email || "", phone: user.phone || "", weight: user.weight || 0, height: user.height || 0 });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleLogout =  async() => {
        dispatch(clearUser());
        await logout();
        localStorage.clear();
        navigate('/login');
    };

    const handleSave = async () => {
        await updateUserByUID(user.uid, { name: formData.name, email: formData.email, phone: formData.phone, weight: formData.weight, height: formData.height });
        dispatch(fetchAllUsers());
        handleLogout();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 text-black backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold mb-4">Kullanıcıyı Güncelle</h2>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                </div>

                <div className="space-y-3">
                    <label className="block">
                        Ad Soyad
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                    </label>

                    <label className="block">
                        Email
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                    </label>

                    <label className="block">
                        Telefon
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                    </label>

                    <div className="flex gap-2 items-center justify-center">
                        <label className="block">
                            Kilo
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                        </label>

                        <label className="block">
                            Boy
                            <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end mt-3">
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserModal