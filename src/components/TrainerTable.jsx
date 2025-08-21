import { useState } from "react";

const TrainerTable = ({ trainers }) => {
    const [openTrainerId, setOpenTrainerId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleUser = (uid) => {
        setOpenTrainerId(openTrainerId === uid ? null : uid);
    };

    const filteredTrainers = trainers.filter((trainer) =>
        trainer.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );
    
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Trainers</h1>
                <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
            </div>
            
            <div className="space-y-2">
                {filteredTrainers.map((trainer) => (
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
        </div>
    )
}

export default TrainerTable