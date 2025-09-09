import React, { useEffect, useState } from 'react'
import { addOwnsToGym, removeOwn, updateGymByID } from '../../../firebase/gyms';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGyms } from '../../../redux/gymSlice';
import { addTrainers, deleteTrainerById } from '../../../firebase/trainers';

const GymModal = ({ isOpen, onClose, selectedGym }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ name: "", address: "" });
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedToRemove, setSelectedToRemove] = useState("");

    const { users } = useSelector((state) => state.user);
    const { trainers } = useSelector((state) => state.trainer);

    useEffect(() => {
        if (selectedGym) {
          setFormData({ name: selectedGym.name || "", address: selectedGym.address || "" });
        }
    }, [selectedGym]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            await updateGymByID(selectedGym.id, formData);
            dispatch(fetchAllGyms());
            onClose();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleAddOwn = async () => {    
        if (!selectedUserId) return alert("Lütfen bir kullanıcı seçin!");
        await addOwnsToGym(selectedGym.id, selectedUserId);
        dispatch(fetchAllGyms());
        onClose();
    };

    const handleRemoveOwn = async () => {
        if (!selectedToRemove) return alert("Lütfen bir sahip seçin!");
        await removeOwn(selectedGym.id, selectedToRemove);
    
        dispatch(fetchAllGyms());
        setSelectedToRemove("");
        onClose();
    };

    const handleAddTrainer = async () => {    
        if (!selectedUserId) return alert("Lütfen bir kullanıcı seçin!");

        try {
            await addTrainers({ userId: selectedUserId, gymId: selectedGym.id });

            dispatch(fetchAllGyms());
            onClose();
        } catch (error) {
            console.error("Eğitmen eklenirken hata:", error);
        }
    };

    const handleRemoveTrainer = async () => {
        if (!selectedToRemove) return alert("Lütfen bir eğitmen seçin!");

        try {
            await deleteTrainerById(selectedToRemove);
            dispatch(fetchAllGyms());
            setSelectedToRemove("");
            onClose();
        } catch (error) {
            console.error("Eğitmen silinirken hata:", error);
        }
    };

    if (!isOpen || !selectedGym || selectedGym.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
                <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold mb-4">Spor salonunu Güncelle</h2>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                </div>

                <div className="space-y-3">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Salon ismi" className="w-full border p-2 rounded" />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adres" className="w-full border p-2 rounded" />
                </div>

                <div className="flex justify-end mt-3">
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
                </div>
                
                {/* Owns add and remove */}
                <div className="mt-6 border-t pt-4 flex gap-6">
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Salona sahip ekle</h3>
                        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full border p-2 rounded">
                            <option value="">Kullanıcı seç</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end mt-3">
                            <button onClick={handleAddOwn} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ekle</button>
                        </div>
                    </div>

                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Salon sahibini kaldır</h3>
                        <select value={selectedToRemove} onChange={(e) => setSelectedToRemove(e.target.value)} className="w-full border p-2 rounded">
                            <option value="">Kullanıcı seç</option>
                            {Array.isArray(selectedGym.ownUser) && selectedGym.ownUser.map((ownerId) => {
                                const user = users.find((u) => u.id === ownerId);
                                return (
                                    <option key={ownerId} value={ownerId}>
                                        {user ? `${user.name} (${user.email})` : ownerId}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="flex justify-end mt-3">
                            <button onClick={handleRemoveOwn} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Kaldır</button>
                        </div>
                    </div>
                </div>

                {/* Trainers add and remove */}
                <div className="mt-6 border-t pt-4 flex gap-6">
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Salona eğitmen ekle</h3>
                        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full border p-2 rounded">
                            <option value="">Kullanıcı seç</option>
                            {users.filter((user) => user.role !== "student").map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end mt-3">
                            <button onClick={handleAddTrainer} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ekle</button>
                        </div>
                    </div>

                   <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Salondan eğitmen sil</h3>

                        <select value={selectedToRemove} onChange={(e) => setSelectedToRemove(e.target.value)} className="w-full border p-2 rounded">
                            <option value="">Kullanıcı seç</option>
                            {trainers.filter((t) => t.gymId === selectedGym.id).map((t) => {
                                const user = users.find((u) => u.id === t.userId);
                                return (
                                    <option key={t.id} value={t.id}>
                                        {user ? `${user.name} (${user.email})` : t.userId}
                                    </option>
                                );
                            })}
                        </select>

                        <div className="flex justify-end mt-3">
                            <button onClick={handleRemoveTrainer} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Kaldır</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GymModal