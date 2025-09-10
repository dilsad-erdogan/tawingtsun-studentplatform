import { useEffect, useState } from "react";
import GymModal from "../modals/updateModals/gymModal";
import AddGymModal from "../modals/addModals/gymModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/userSlice";
import { fetchAllGyms } from "../../redux/gymSlice";
import { fetchAllTrainers } from "../../redux/trainerSlice";
import { fetchAllStudents } from "../../redux/studentSlice";

const GymsTable = () => {
    const dispatch = useDispatch();
    const { users, loadingUser, errorUser } = useSelector((state) => state.user);
    const { gyms, loading, error } = useSelector((state) => state.gym);
    const { trainers, loadingTrainer, errorTrainer } = useSelector((state) => state.trainer);
    const { students, loadingStudent, errorStudent } = useSelector((state) => state.student);

    const [openGymId, setOpenGymId] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedGym, setSelectedGym] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleGym = (uid) => {
        setOpenGymId(openGymId === uid ? null : uid);
    };

    const openUpdateModal = (gym) => {
        setSelectedGym(gym);
        setUpdateModalOpen(true);
    };

    const closeModal = () => {
        setUpdateModalOpen(false);
        setAddModalOpen(false);
        setSelectedGym(null);
    };

    const getUserName = (userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? `${user.name} (${user.email})` : "Bilinmiyor";
    };

    const filteredGyms = gyms.filter((gym) =>
        gym.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );

    const openAddModal = () => {
        setAddModalOpen(true);
    };

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAllGyms());
        dispatch(fetchAllTrainers());
        dispatch(fetchAllStudents());
    }, [dispatch]);
    
    if (loadingUser || loading || loadingTrainer || loadingStudent) return <div className="p-4">Loading...</div>;
    if (errorUser || error || errorTrainer || errorStudent) return <div className="p-4 text-red-500">{errorUser || error}</div>;
    

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Gyms</h1>
                <button onClick={() => openAddModal()} className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Spor Salonu Ekle</button>
                <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
            </div>

            <div className="space-y-2">
                {filteredGyms.map((gym) => {
                    const gymTrainers = trainers.filter((t) => t.gymId === gym.id);

                    return (
                        <div key={gym.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                            <button onClick={() => toggleGym(gym.id)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                                <span>{gym.name}</span>
                                <span>{openGymId === gym.id ? "▲" : "▼"}</span>
                            </button>

                            {openGymId === gym.id && (
                                <div className="px-4 py-3 bg-gray-50 text-sm">
                                    <p><strong>Address:</strong> {gym.address}</p>
                                    <p><strong>Total Salary Month:</strong> {gym.totalSalaryMonth}</p>
                                    <p>
                                        <strong>Own User:</strong>{" "}
                                        {Array.isArray(gym.ownUser) ? gym.ownUser.map((id) => getUserName(id)).join(", ") : getUserName(gym.ownUser)}
                                    </p>

                                    <div className="mt-2">
                                        <strong>Trainers:</strong>
                                        {gymTrainers.length > 0 ? (
                                            <ul className="ml-4 list-disc">
                                                {gymTrainers.map((t) => {
                                                    const trainerName = getUserName(t.userId);
                                                    const trainerStudents = students.filter((s) => s.trainerId === t.id);

                                                    return (
                                                        <li key={t.id}>
                                                            {trainerName}
                                                            {trainerStudents.length > 0 ? (
                                                                <ul className="ml-6 list-square text-gray-700">
                                                                    {trainerStudents.map((s) => (
                                                                        <li key={s.id}>
                                                                            {getUserName(s.userId)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p className="ml-6 text-gray-500 text-sm">
                                                                    Öğrenci yok
                                                                </p>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p>Bu salona kayıtlı eğitmen yok</p>
                                        )}
                                    </div>

                                    <button onClick={() => openUpdateModal(gym)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Güncelle
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <AddGymModal isOpen={addModalOpen} onClose={closeModal} />
            <GymModal isOpen={updateModalOpen} onClose={closeModal} selectedGym={selectedGym} />
        </div>
    );
};

export default GymsTable;