import { useState } from "react";
import AddTrainerModal from "../modals/addModals/trainerModal";
import TrainerModal from "../modals/updateModals/trainerModal";
import { Filter } from "lucide-react";

const TrainerTable = ({ trainers, users, gyms }) => {
    const [openTrainerId, setOpenTrainerId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterGym, setFilterGym] = useState("");

    const toggleUser = (uid) => {
        setOpenTrainerId(openTrainerId === uid ? null : uid);
    };

    const filteredTrainers = trainers.filter((trainer) => {
        const user = users.find((u) => u.id === trainer.userId);

        const matchesName =
            user &&
            user.name.toLocaleLowerCase("tr").includes(
                searchTerm.trim().toLocaleLowerCase("tr")
            );

        const matchesGym = !filterGym || trainer.gymId === filterGym;

        return matchesName && matchesGym;
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
        <div className={`grid gap-4 transition-all duration-300 ${filterOpen ? "lg:grid-cols-[1fr_300px]" : "lg:grid-cols-1"} grid-cols-1`}>
            {/* Main table */}
            <div className="p-6 max-w-2xl mx-auto w-full">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Trainers</h1>
                    <button onClick={() => openAddModal()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eğitimci Ekle</button>
                    <button onClick={() => setFilterOpen(!filterOpen)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"><Filter size={18} /></button>
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

            {/* Right section */}
            {filterOpen && (
                <div className="p-4 bg-white shadow-lg border rounded h-fit w-64">
                    <h2 className="text-lg font-semibold mb-4">Filtrele</h2>

                    {/* Role Filter */}
                    <div className="mb-3">
                        <label className="block text-sm mb-1">Salonlar</label>
                        <select value={filterGym} onChange={(e) => setFilterGym(e.target.value)} className="w-full border px-2 py-1 rounded">
                            <option value="">Salon Seç</option>
                            {gyms.map((gym) => (
                                <option key={gym.id} value={gym.id}>{gym.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrainerTable