import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, ExternalLink } from 'lucide-react';
import ImageViewerModal from '../modals/ImageViewerModal';
import RegistrationFormsModal from '../modals/RegistrationFormsModal';

const RegistrationFormsSection = () => {
    const { student } = useSelector((state) => state.student);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    if (!student) return null;

    const forms = student.registrationForms || [];

    // Helper to get URL and Name regardless of data structure
    const getFileData = (item, index) => {
        if (typeof item === 'string') {
            return { url: item, name: `Form ${index + 1}` };
        }
        return { url: item.url, name: item.name || `Form ${index + 1}` };
    };

    const handleImageClick = (file, e) => {
        e.stopPropagation();
        setPreviewImage(file);
    };

    const isPdf = (url) => url.toLowerCase().endsWith('.pdf');

    return (
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Kayıt Formları</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    {forms.length > 0 ? "Form Ekle" : "Form Yükle"}
                </button>
            </div>

            {forms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {forms.map((item, index) => {
                        const file = getFileData(item, index);
                        const isFilePdf = isPdf(file.url);

                        return (
                            <div
                                key={index}
                                className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-gray-50 flex flex-col"
                            >
                                <div
                                    className="h-48 overflow-hidden cursor-pointer relative flex items-center justify-center bg-gray-200"
                                    onClick={(e) => isFilePdf ? window.open(file.url, '_blank') : handleImageClick(file, e)}
                                >
                                    {isFilePdf ? (
                                        <div className="text-center p-4">
                                            <span className="text-5xl">📄</span>
                                            <p className="mt-2 text-sm text-gray-600">PDF Dosyası</p>
                                        </div>
                                    ) : (
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<div class="text-center p-4 text-gray-400"><span class="text-3xl">⚠️</span><p class="text-xs mt-1">Görsel Yüklenemedi</p></div>';
                                            }}
                                        />
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                            {isFilePdf ? 'Aç' : 'Büyüt'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border-t flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                                        {file.name}
                                    </span>
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-blue-600"
                                        title="Yeni sekmede aç"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-dashed">
                    <p>Henüz kayıt formu yüklenmemiş.</p>
                </div>
            )}

            {/* Image Viewer Modal */}
            <ImageViewerModal
                isOpen={!!previewImage}
                imageUrl={previewImage?.url}
                imageName={previewImage?.name}
                onClose={() => setPreviewImage(null)}
            />

            <RegistrationFormsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                student={student}
            />
        </div>
    );
};

export default RegistrationFormsSection;
