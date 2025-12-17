import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateStudent } from '../../../redux/studentSlice';
import toast from 'react-hot-toast';

const RegistrationFormsModal = ({ isOpen, onClose, student }) => {
    const dispatch = useDispatch();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (indexToRemove) => {
        setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Lütfen en az bir dosya seçin.");
            return;
        }

        setUploading(true);
        const uploadedItems = [];

        try {
            // const isDev = window.location.hostname === 'localhost';
            // const apiUrl = isDev
            //     ? 'http://localhost:5000/api/upload'
            //     : 'https://taccounting.online/api/upload';

            // User requested to force domain usage
            const apiUrl = 'https://taccounting.online/api/upload';

            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);

                // Upload to Node.js backend
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Upload failed for file: ${file.name}`);
                }

                const data = await response.json();
                uploadedItems.push({
                    url: data.filePath,
                    name: file.name
                });
            }

            const currentForms = student.registrationForms || [];
            // Merge new items
            const updatedForms = [...currentForms, ...uploadedItems];

            await dispatch(updateStudent({
                studentId: student.id,
                updatedData: { registrationForms: updatedForms }
            })).unwrap();

            toast.success("Dosyalar başarıyla yüklendi.");
            onClose();
            setSelectedFiles([]);
        } catch (error) {
            console.error("Upload error:", error);
            // Show more specific error
            toast.error(`Yükleme hatası: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Kayıt Formu Yükle</h2>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-12 h-12 text-blue-500 mb-3" />
                    <p className="text-gray-700 font-medium">Dosyaları seçmek için tıklayın</p>
                    <p className="text-sm text-gray-400 mt-1">veya buraya sürükleyin</p>
                </div>

                {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-gray-700">Seçilen Dosyalar ({selectedFiles.length})</h3>
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 truncate">{file.name}</span>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
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
