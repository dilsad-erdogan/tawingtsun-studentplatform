import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserByUID, addPaymentToUser } from "../../../firebase/users";
import { fetchAllUsers } from "../../../redux/userSlice";

const UserModal = ({ isOpen, onClose, selectedUser }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", gender: "", weight: 0, height: 0, age: 0, salary: 0 });

  useEffect(() => {
    if (selectedUser) {
      setFormData({ name: selectedUser.name || "", email: selectedUser.email || "", phone: selectedUser.phone || "", gender: selectedUser.gender || "", weight: selectedUser.weight || 0, height: selectedUser.height || 0, age: selectedUser.age || 0, salary: 0 });
    }
  }, [selectedUser]);
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    await updateUserByUID(selectedUser.uid, { name: formData.name, email: formData.email, phone: formData.phone, gender: formData.gender, weight: formData.weight, height: formData.height, age: formData.age });
    dispatch(fetchAllUsers());
    onClose();
  };

//   const handleAddPayment = async () => {
//     if (!formData.salary) {
//       alert("Lütfen bir ücret girin!");
//       return;
//     }
//     try {
//       await addPaymentToUser(selectedUser.uid, formData.salary);
//       dispatch(fetchAllUsers());
//       onClose();
//     } catch (error) {
//       console.error("Add payment failed:", error);
//     }
//   };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
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
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Kaydet
          </button>
        </div>

        {/* <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Ödeme Ekle</h3>
          <label className="block">
            Ücret
            <input type="number" name="salary" value={formData.salary || ""} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </label>
          <div className="flex justify-end mt-3">
            <button onClick={handleAddPayment} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Ekle
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserModal;