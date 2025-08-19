import { useState } from "react";
import { updateUserByUID } from "../firebase/users";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../redux/userSlice";

const UsersTable = ({ users }) => {
    const dispatch = useDispatch();

    const [openUserId, setOpenUserId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

    const toggleUser = (uid) => {
        setOpenUserId(openUserId === uid ? null : uid);
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            const updatedUser = { ...selectedUser, ...formData };
            console.log("Updated User:", updatedUser);

            await updateUserByUID(selectedUser.uid, formData);
            dispatch(fetchAllUsers());
            closeModal();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <div className="space-y-2">
                {users.map((user) => (
                    <div key={user.uid} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                        <button onClick={() => toggleUser(user.uid)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                            <span>
                                {user.name} {user.surname}
                            </span>
                            <span>{openUserId === user.uid ? "▲" : "▼"}</span>
                        </button>

                        {/* Details */}
                        {openUserId === user.uid && (
                            <div className="px-4 py-3 bg-gray-50 text-sm">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Telefon:</strong> {user.phone}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Payments:</strong> {user.payments}</p>
                                <button onClick={() => openModal(user)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Güncelle</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Kullanıcıyı Güncelle</h2>

                        <div className="space-y-3">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ad Soyad" className="w-full border p-2 rounded" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" className="w-full border p-2 rounded" />
                        </div>

                        <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Kaydet
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UsersTable