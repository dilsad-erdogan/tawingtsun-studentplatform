import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserRole } from "../../../firebase/users";
import { fetchAllUsers } from "../../../redux/userSlice";
import { addTrainers } from "../../../firebase/trainers";
import { fetchAllTrainers } from "../../../redux/trainerSlice";

const AddTrainerModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedGymId, setSelectedGymId] = useState("");

  const { users } = useSelector((state) => state.user);
  const { gyms } = useSelector((state) => state.gym);

  if (!isOpen) return null;

    const handleSave = async () => {
        try {
            if (!selectedUserId) {
                alert("Lütfen bir kullanıcı ve salon seçin");
                return;
            }

            const newGym = {
                userId: selectedUserId,
                gymId: selectedGymId
            };

            await updateUserRole(selectedUserId);
            await addTrainers(newGym);
            dispatch(fetchAllUsers());
            dispatch(fetchAllTrainers());
            onClose();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">                   
            <div className="flex justify-between mb-3">
                <h2 className="text-xl font-semibold mb-4">Eğitimci Ekle</h2>
                <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
            </div>

            <div className="space-y-3">
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full border p-2 rounded">
                    <option value="">Kullanıcı seç</option>
                        {users.filter((user) => user.role == "student").map((user) => (
                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                        ))}
                </select>
            </div>

            <div className="space-y-3 mt-5">
                <select value={selectedGymId} onChange={(e) => setSelectedGymId(e.target.value)} className="w-full border p-2 rounded">
                    <option value="">Salon seç</option>
                    {gyms.map((gym) => (
                        <option key={gym.id} value={gym.id}>{gym.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end mt-3">
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
            </div>
      </div>
    </div>
  );
};

export default AddTrainerModal;