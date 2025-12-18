import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transferStudents, fetchAllStudents } from '../../../redux/studentSlice';
import { X, ChevronRight, ChevronLeft, Check, Users, ArrowRightLeft } from 'lucide-react';

const TransferStudentsModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { gyms } = useSelector((state) => state.gym);
    const { students } = useSelector((state) => state.student);

    const [step, setStep] = useState(1);
    const [sourceGymId, setSourceGymId] = useState('');
    const [targetGymId, setTargetGymId] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSourceGymId('');
            setTargetGymId('');
            setSelectedStudentIds([]);
            dispatch(fetchAllStudents());
        }
    }, [isOpen, dispatch]);

    const activeGyms = gyms.filter(gym => gym.isActive !== false);

    // Filter students belonging to source gym
    const sourceStudents = students.filter(s => s.gymId === sourceGymId && s.isActive);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudentIds(sourceStudents.map(s => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleStudentToggle = (studentId) => {
        if (selectedStudentIds.includes(studentId)) {
            setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
        } else {
            setSelectedStudentIds(prev => [...prev, studentId]);
        }
    };

    const handleTransfer = async () => {
        if (!targetGymId || selectedStudentIds.length === 0) return;

        await dispatch(transferStudents({
            studentIds: selectedStudentIds,
            targetGymId: targetGymId
        }));

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-red-600 p-4 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ArrowRightLeft className="w-6 h-6" />
                        Öğrenci Aktarımı
                    </h2>
                    <button onClick={onClose} className="hover:bg-red-700 p-1 rounded transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-100 p-4 border-b">
                    <div className="flex justify-between items-center max-w-xs mx-auto text-xs font-semibold text-gray-500 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -z-0 -translate-y-1/2 rounded"></div>
                        <div className={`absolute top-1/2 left-0 h-1 bg-red-600 -z-0 -translate-y-1/2 rounded transition-all duration-300`}
                            style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

                        {/* Steps */}
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`relative z-10 flex flex-col items-center gap-1 ${step >= s ? 'text-red-600' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${step >= s ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {s}
                                </div>
                                <span>{s === 1 ? 'Kaynak' : s === 2 ? 'Öğrenciler' : 'Hedef'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {step === 1 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Hangi salondan öğrenci alacaksınız?</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {activeGyms.map(gym => (
                                    <button
                                        key={gym.id}
                                        onClick={() => setSourceGymId(gym.id)}
                                        className={`p-4 rounded-lg border text-left transition hover:shadow-md ${sourceGymId === gym.id ? 'border-red-600 bg-red-50 ring-2 ring-red-200' : 'border-gray-200 hover:border-red-300'}`}
                                    >
                                        <div className="font-semibold text-gray-800">{gym.name}</div>
                                        <div className="text-sm text-gray-500">{gym.address}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col h-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Aktarılacak öğrencileri seçin</h3>

                            {sourceStudents.length > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                                        <input
                                            type="checkbox"
                                            id="selectAll"
                                            checked={selectedStudentIds.length === sourceStudents.length && sourceStudents.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                                        />
                                        <label htmlFor="selectAll" className="text-sm font-semibold text-gray-700 cursor-pointer select-none flex-1">
                                            Tümünü Seç ({sourceStudents.length} Öğrenci)
                                        </label>
                                        <span className="text-sm font-bold text-red-600">
                                            Seçilen: {selectedStudentIds.length}
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto max-h-[400px] border rounded-lg divide-y">
                                        {sourceStudents.map(student => (
                                            <div key={student.id}
                                                onClick={() => handleStudentToggle(student.id)}
                                                className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition ${selectedStudentIds.includes(student.id) ? 'bg-red-50' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={() => { }}
                                                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 pointer-events-none"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-800">{student.name}</div>
                                                    <div className="text-xs text-gray-500">{student.phone} • {student.level}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Bu salonda aktif öğrenci bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Öğrenciler hangi salona aktarılacak?</h3>

                            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4 flex items-start gap-3">
                                <Users className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-bold text-yellow-800 block mb-1">Özet</span>
                                    <p className="text-sm text-yellow-700">
                                        <span className="font-bold">{selectedStudentIds.length}</span> adet öğrenci seçildi.
                                        Hedef salonu seçip onayladığınızda bu öğrencilerin kaydı kalıcı olarak taşınacaktır.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {activeGyms.filter(g => g.id !== sourceGymId).map(gym => (
                                    <button
                                        key={gym.id}
                                        onClick={() => setTargetGymId(gym.id)}
                                        className={`p-4 rounded-lg border text-left transition hover:shadow-md ${targetGymId === gym.id ? 'border-green-600 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'}`}
                                    >
                                        <div className="font-semibold text-gray-800">{gym.name}</div>
                                        <div className="text-sm text-gray-500">{gym.address}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition font-medium"
                        >
                            <ChevronLeft className="w-5 h-5" /> Geri
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={(step === 1 && !sourceGymId) || (step === 2 && selectedStudentIds.length === 0)}
                            className="flex items-center gap-1 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            İleri <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleTransfer}
                            disabled={!targetGymId}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            <Check className="w-5 h-5" /> Aktarımı Tamamla
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransferStudentsModal;
