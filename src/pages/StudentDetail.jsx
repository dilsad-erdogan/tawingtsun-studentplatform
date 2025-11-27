import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StudentDetail = () => {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Öğrenci Detayı</h1>
                <p>Öğrenci ID: {id}</p>
                <p className="text-gray-500 mt-2">Burada öğrenci detayları ve ödeme geçmişi yer alacak.</p>
            </div>
        </div>
    );
};

export default StudentDetail;
