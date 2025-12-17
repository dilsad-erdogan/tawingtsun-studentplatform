import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ImageUploader = ({ onUploadSuccess, currentImage }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            toast.error('Lütfen sadece resim veya PDF dosyası yükleyin.');
            return;
        }

        // Preview for images
        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }

        await uploadFile(file);
    };

    const uploadFile = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Determine API URL based on environment
            // If in development (localhost), assume server is on port 5000
            // If in production, assume server is at the root /api/upload or full domain
            const isDev = window.location.hostname === 'localhost';
            const apiUrl = isDev
                ? 'http://localhost:5000/api/upload'
                : 'https://taccounting.online/api/upload';

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Dosya başarıyla yüklendi!');
                if (onUploadSuccess) {
                    onUploadSuccess(data.filePath);
                }
            } else {
                throw new Error(data.message || 'Yükleme başarısız');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            toast.error(`Yükleme hatası: ${error.message}`);
            // Revert preview if failed
            setPreview(currentImage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-sm p-2 text-center">Fotoğraf Yükle</span>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                )}

                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    disabled={uploading}
                />
            </div>
            <p className="text-xs text-gray-500">Değiştirmek için üzerine tıklayın</p>
        </div>
    );
};

export default ImageUploader;
