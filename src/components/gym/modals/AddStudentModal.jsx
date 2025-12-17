import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { addNewStudent } from "../../../firebase/students";
import { fetchAllStudents } from "../../../redux/studentSlice";
import DocumentUploader from "../../common/DocumentUploader";

const AddStudentModal = ({ isOpen, onClose, gymId }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        group: "",
        level: 1,
        studyPeriod: 1,
    });
    const [registrationForms, setRegistrationForms] = useState([]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUploadSuccess = (url, name) => {
        setRegistrationForms(prev => [...prev, { url, name }]);
    };

    const removeForm = (index) => {
        setRegistrationForms(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!formData.name || !formData.phone) {
            toast.error("İsim ve Telefon zorunludur.");
            return;
        }

        setLoading(true);
        try {
            await addNewStudent({
                ...formData,
                gymId,
                level: Number(formData.level),
                studyPeriod: Number(formData.studyPeriod),
                phone: Number(formData.phone),
                registrationForms: registrationForms
            });

            toast.success("Öğrenci başarıyla eklendi 🎉");
            dispatch(fetchAllStudents()); // Listeyi güncelle
            onClose();
            setFormData({ name: "", phone: "", group: "", level: 1, studyPeriod: 1 });
            setRegistrationForms([]);
        } catch (error) {
            console.error("Öğrenci ekleme hatası:", error);
            toast.error("Hata oluştu: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-scaleIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-800">Yeni Öğrenci Ekle</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Örn: Ali Yılmaz"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <input
                            type="number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="5xxxxxxxxx"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grup</label>
                        <select
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">Seçiniz</option>
                            <option value="Çocuk">Çocuk</option>
                            <option value="Erkek">Erkek</option>
                            <option value="Kadın">Kadın</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seviye (Level)</label>
                            <input
                                type="number"
                                name="level"
                                min="1"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenim Süresi (Ay)</label>
                            <input
                                type="number"
                                name="studyPeriod"
                                min="1"
                                value={formData.studyPeriod}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    {/* Document Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kayıt Belgeleri / Fotoğraflar</label>
                        <DocumentUploader onUploadSuccess={handleUploadSuccess} />

                        {registrationForms.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {registrationForms.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px]">
                                            {file.name || "Dosya " + (index + 1)}
                                        </a>
                                        <button
                                            onClick={() => removeForm(index)}
                                            className="text-red-500 hover:text-red-700"
                                            type="button"
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                        disabled={loading}
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStudentModal;
