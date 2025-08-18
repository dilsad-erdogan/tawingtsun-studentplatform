import { useState } from "react";

const UsersTable = ({ users }) => {
    const [openUserId, setOpenUserId] = useState(null);

    const toggleUser = (uid) => {
        setOpenUserId(openUserId === uid ? null : uid);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <div className="space-y-2">
                {users.map((user) => (
                    <div key={user.uid} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                        <button onClick={() => toggleUser(user.uid)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                            <span>
                                {user.name} {user.surname}
                            </span>
                            <span>{openUserId === user.uid ? "▲" : "▼"}</span>
                        </button>

                        {/* Details */}
                        {openUserId === user.uid && (
                            <div className="px-4 py-3 bg-gray-50 text-sm">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.phone}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Payments:</strong> {user.payments}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UsersTable