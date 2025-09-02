import { useState } from "react";
import AddTrainerModal from "../modals/addModals/trainerModal";
import TrainerModal from "../modals/updateModals/trainerModal";

const TrainerTable = ({ trainers, users, gyms }) => {
    const [openTrainerId, setOpenTrainerId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);

    const toggleUser = (uid) => {
        setOpenTrainerId(openTrainerId === uid ? null : uid);
    };

    const filteredTrainers = trainers.filter((trainer) => {
        const user = users.find((u) => u.id === trainer.userId);
        return (
            user &&
            user.name.toLocaleLowerCase("tr").includes(
                searchTerm.trim().toLocaleLowerCase("tr")
            )
        );
    });

    const openAddModal = () => {
        setAddModalOpen(true);
    };

    const openModal = (user) => {
        setSelectedTrainer(user);
        setModalOpen(true);
    };

    const closeModal = () => {
        setAddModalOpen(false);
        setModalOpen(false);
    };

    const groupedTrainers = filteredTrainers.reduce((acc, trainer) => {
        if (!acc[trainer.userId]) {
            acc[trainer.userId] = [];
        }
        acc[trainer.userId].push(trainer);
        return acc;
    }, {});
    
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Trainers</h1>
                <button onClick={() => openAddModal()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eğitimci Ekle</button>
                <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
            </div>
            
            <div className="space-y-2">
                {Object.entries(groupedTrainers).map(([userId, trainerList]) => {
                    const user = users.find((u) => u.id === userId);

                    return (
                        <div key={userId} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                            <button onClick={() => toggleUser(userId)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                                <span>
                                    {user ? `${user.name} (${user.email})` : userId}
                                </span>
                                <span>{openTrainerId === userId ? "▲" : "▼"}</span>
                            </button>

                            {openTrainerId === userId && (
                                <div className="px-4 py-3 bg-gray-50 text-sm">
                                    <p>
                                        <strong>Eğitim verdiği salonlar:</strong>{" "}
                                        {trainerList.map((trainer, index) => {
                                            const gym = gyms.find((g) => g.id === trainer.gymId);
                                            return (
                                                <span key={trainer.gymId}>
                                                    {gym ? gym.name : trainer.gymId}
                                                    {index < trainerList.length - 1 ? ", " : ""}
                                                </span>
                                            );
                                        })}
                                    </p>
                                    <p>
                                        <strong>Aylık toplam kazanç:</strong>{" "}
                                        {trainerList.reduce((sum, t) => sum + t.totalSalaryMonth, 0)}
                                    </p>

                                    <button onClick={() => openModal(trainerList )} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Güncelle
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <AddTrainerModal isOpen={addModalOpen} onClose={closeModal} />
            <TrainerModal isOpen={modalOpen} onClose={closeModal} selectedTrainer={selectedTrainer} allGyms={gyms} users={users} />
        </div>
    )
}

export default TrainerTable