import { useState } from "react";

const GymsTable = ({ gyms }) => {
    const [openGymId, setOpenGymId] = useState(null);

    const toggleGym = (uid) => {
        setOpenGymId(openGymId === uid ? null : uid);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gyms</h1>
            <div className="space-y-2">
                {gyms.map((gym) => (
                    <div key={gym.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                        <button onClick={() => toggleGym(gym.id)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                            <span>{gym.name}</span>
                            <span>{openGymId === gym.id ? "▲" : "▼"}</span>
                        </button>

                        {/* Details */}
                        {openGymId === gym.id && (
                            <div className="px-4 py-3 bg-gray-50 text-sm">
                                <p><strong>Address:</strong> {gym.address}</p>
                                <p><strong>Total Salary Month:</strong> {gym.totalSalaryMonth}</p>
                                <p><strong>Own User:</strong> {gym.ownUser}</p>
                                <p><strong>Trainers:</strong> {gym.trainers}</p>
                                <p><strong>Students:</strong> {gym.students}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GymsTable