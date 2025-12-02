import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateStudent } from '../../../firebase/students';
import { fetchAllStudents, fetchStudentById } from '../../../redux/studentSlice';

const StudentModal = ({ isOpen, onClose, selectedStudent }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        group: "",
        level: "",
        studyPeriod: ""
    });

    useEffect(() => {
        if (selectedStudent) {
            setFormData({
                name: selectedStudent.name || "",
                phone: selectedStudent.phone || "",
                group: selectedStudent.group || "",
                level: selectedStudent.level || "",
                studyPeriod: selectedStudent.studyPeriod || ""
            });
        }
    }, [selectedStudent]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        await updateStudent(selectedStudent.id, formData);
        dispatch(fetchAllStudents());
        dispatch(fetchStudentById(selectedStudent.id));
        onClose();
    };

    if (!isOpen || !selectedStudent) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold mb-4">Öğrenciyi Güncelle</h2>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">İsim Soyisim</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Telefon</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Grup</label>
                        <input type="text" name="group" value={formData.group} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Seviye</label>
                        <input type="text" name="level" value={formData.level} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Çalışma Süresi (Ay)</label>
                        <input type="text" name="studyPeriod" value={formData.studyPeriod} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div className="flex justify-end mt-3">
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
                </div>
            </div>
        </div>
    )
}

export default StudentModal
