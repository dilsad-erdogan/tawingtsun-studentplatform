import React, { useState } from 'react';
import toast from 'react-hot-toast';

const DocumentUploader = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            toast.error('Lütfen sadece resim veya PDF dosyası yükleyin.');
            return;
        }

        await uploadFile(file);
        // Reset input so same file can be selected again if needed
        e.target.value = '';
    };

    const uploadFile = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // const isDev = window.location.hostname === 'localhost';
            // const apiUrl = isDev
            //     ? 'http://localhost:5000/api/upload'
            //     : 'https://taccounting.online/api/upload';

            // User requested to force domain usage
            const apiUrl = 'https://taccounting.online/api/upload';

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Dosya yüklendi!');
                if (onUploadSuccess) {
                    onUploadSuccess(data.filePath, file.name);
                }
            } else {
                throw new Error(data.message || 'Yükleme başarısız');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            toast.error(`Yükleme hatası: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <label className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Yükleniyor...
                </>
            ) : (
                <>
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Belge/Fotoğraf Ekle
                </>
            )}
            <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                disabled={uploading}
            />
        </label>
    );
};

export default DocumentUploader;
