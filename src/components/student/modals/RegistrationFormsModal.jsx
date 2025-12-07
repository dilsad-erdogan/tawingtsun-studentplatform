import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../../firebase/firebase';
import { updateStudent } from '../../../redux/studentSlice';
import toast from 'react-hot-toast';

const RegistrationFormsModal = ({ isOpen, onClose, student }) => {
    const dispatch = useDispatch();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Lütfen en az bir dosya seçin.");
            return;
        }

        setUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of selectedFiles) {
                const storageRef = ref(storage, `students/${student.id}/forms/${file.name}-${Date.now()}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                uploadedUrls.push(url);
            }

            const currentForms = student.registrationForms || [];
            const updatedForms = [...currentForms, ...uploadedUrls];

            await dispatch(updateStudent({
                studentId: student.id,
                updatedData: { registrationForms: updatedForms }
            })).unwrap();

            toast.success("Dosyalar başarıyla yüklendi.");
            onClose();
            setSelectedFiles([]);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Dosya yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Kayıt Formu Yükle</h2>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4 w-full border p-2 rounded"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={uploading}
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleUpload}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={uploading}
                    >
                        {uploading ? "Yükleniyor..." : "Yükle"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationFormsModal;
