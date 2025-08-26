import { useState } from "react";
import { updateUserRole } from "../../firebase/users";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/userSlice";

const TrainerTable = ({ trainers, users }) => {
    const dispatch = useDispatch();

    console.log(trainers)

    const [selectedUserId, setSelectedUserId] = useState("");
    const [openTrainerId, setOpenTrainerId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [addModalOpen, setAddModalOpen] = useState(false);

    const toggleUser = (uid) => {
        setOpenTrainerId(openTrainerId === uid ? null : uid);
    };

    // const filteredTrainers = trainers.filter((trainer) =>
    //     trainer.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    // );

    const openAddModal = () => {
        setSelectedUserId("");
        setAddModalOpen(true);
    };

    const closeModal = () => {
        setAddModalOpen(false);
    };

    const handleSave = async () => {
        try {
            if (!selectedUserId) {
                alert("Lütfen bir kullanıcı seçin");
                return;
            }

            await updateUserRole(selectedUserId); 
            dispatch(fetchAllUsers());
            closeModal();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };
    
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Trainers</h1>
                <button onClick={() => openAddModal()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eğitimci Ekle</button>
                <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
            </div>
            
            <div className="space-y-2">
                {trainers.map((trainer) => (
                    <div key={trainer.uid} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                        <button onClick={() => toggleUser(trainer.uid)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                            <span>
                                {trainer.name} {trainer.surname}
                            </span>
                            <span>{openTrainerId === trainer.uid ? "▲" : "▼"}</span>
                        </button>

                        {/* Details */}
                        {openTrainerId === trainer.uid && (
                            <div className="px-4 py-3 bg-gray-50 text-sm">
                                <p><strong>Email:</strong> {trainer.email}</p>
                                <p><strong>Phone:</strong> {trainer.phone}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {addModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">                    
                        <div className="flex justify-between mb-3">
                            <h2 className="text-xl font-semibold mb-4">Eğitimci Ekle</h2>
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">X</button>
                        </div>

                        <div className="space-y-3">
                            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full border p-2 rounded">
                                <option value="">Kullanıcı seç</option>
                                {users
                                    .filter((user) => user.role !== "trainer")
                                    .map((user) => (
                                        <option key={user.uid} value={user.uid}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="flex justify-end mt-3">
                            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrainerTable