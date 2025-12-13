import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RegistrationFormsModal from '../modals/registrationFormsModal';

const RegistrationFormsSection = () => {
    const { student } = useSelector((state) => state.student);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!student) return null;

    const forms = student.registrationForms || [];

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
                    {forms.map((url, index) => (
                        <div key={index} className="border rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img
                                src={url}
                                alt={`Form ${index + 1}`}
                                className="w-full h-48 object-cover cursor-pointer"
                                onClick={() => window.open(url, '_blank')}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-dashed">
                    <p>Henüz kayıt formu yüklenmemiş.</p>
                </div>
            )}

            <RegistrationFormsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                student={student}
            />
        </div>
    );
};

export default RegistrationFormsSection;
