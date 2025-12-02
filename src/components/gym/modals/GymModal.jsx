import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

import { updateGymByID } from '../../../firebase/gyms';
import { fetchAllGyms, fetchGymById } from '../../../redux/gymSlice';

const GymModal = ({ isOpen, onClose, selectedGym }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ name: "", address: "" });

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
        await updateGymByID(selectedGym.id, formData);
        dispatch(fetchAllGyms());
        dispatch(fetchGymById(selectedGym.id));
        onClose();
    };

    if (!isOpen || !selectedGym || selectedGym.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] max-h-[90vh] overflow-y-auto">
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
            </div>
        </div>
    )
}

export default GymModal