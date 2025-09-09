import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addGyms } from '../../../firebase/gyms';
import { fetchAllGyms } from '../../../redux/gymSlice';

const AddGymModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ name: "", address: "" });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAddSave = async () => {
        try {
            const newGym = {
                name: formData.name,
                address: formData.address
            };
        
            const result = await addGyms(newGym);
            if (result) {
                console.log("Salon başarıyla eklendi:", result);
            }
        
            dispatch(fetchAllGyms());
            onClose();
        } catch (error) {
            console.error("Add failed:", error);
        }
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
                <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold mb-4">Salon Ekle</h2>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                </div>

                <div className="space-y-3">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="İsim" className="w-full border p-2 rounded" />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adres" className="w-full border p-2 rounded" />
                </div>

                <div className="flex justify-end mt-3">
                    <button onClick={handleAddSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
                </div>
            </div>
        </div>
   )
}

export default AddGymModal