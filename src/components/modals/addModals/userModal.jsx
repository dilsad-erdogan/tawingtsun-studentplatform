import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../../firebase/users";
import { fetchAllUsers } from "../../../redux/userSlice";

const AddUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", gender: "", weight: 0, height: 0, age: 0, });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const newUser = { name: formData.name, email: formData.email, phone: formData.phone, gender: formData.gender, weight: formData.weight, height: formData.height, age: formData.age };

      const result = await addUser(newUser);
      if (result) {
        console.log("Kullanıcı başarıyla eklendi:", result);
      }

      dispatch(fetchAllUsers());
      onClose();
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl font-semibold mb-4">Kullanıcı Ekle</h2>
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

          <div className="block">
            <span className="block mb-1">Cinsiyet</span>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} className="mr-2" />
                Erkek
              </label>
              <label className="flex items-center">
                <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} className="mr-2" />
                Kadın
              </label>
            </div>
          </div>

          <label className="block">
            Kilo
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </label>

          <label className="block">
            Boy
            <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </label>

          <label className="block">
            Yaş
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </label>
        </div>

        <div className="flex justify-end mt-3">
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;