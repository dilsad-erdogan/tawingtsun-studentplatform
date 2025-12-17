import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

const ImageViewerModal = ({ isOpen, onClose, imageUrl, imageName }) => {
    if (!isOpen || !imageUrl) return null;

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = imageName || 'downloaded-image';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(imageUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col animate-fadeIn">
            {/* Toolbar */}
            <div className="flex justify-between items-center p-4 bg-black/50 text-white z-10">
                <h3 className="text-lg font-medium truncate max-w-md">{imageName}</h3>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="İndir"
                    >
                        <Download size={24} />
                    </button>
                    <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Yeni sekmede aç"
                    >
                        <ExternalLink size={24} />
                    </a>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-500/80 rounded-full transition-colors"
                        title="Kapat"
                    >
                        <X size={28} />
                    </button>
                </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden" onClick={onClose}>
                <img
                    src={imageUrl}
                    alt={imageName}
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

export default ImageViewerModal;
