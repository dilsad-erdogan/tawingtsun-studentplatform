import { useState } from "react";
import UserModal from "../modals/updateModals/userModal";
import AddUserModal from "../modals/addModals/userModal";

const UsersTable = ({ users }) => {
    const [openUserId, setOpenUserId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleUser = (uid) => {
        setOpenUserId(openUserId === uid ? null : uid);
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setAddModalOpen(false);
        setSelectedUser(null);
    };
    const filteredUsers = users.filter((user) =>
        user.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"))
    );

    const openAddModal = () => {
        setAddModalOpen(true);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <button onClick={() => openAddModal()} className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Kullanıcı Ekle</button>
                <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
            </div>

            <div className="space-y-2">
                {filteredUsers.map((user) => (
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
                                <p><strong>Telefon:</strong> {user.phone}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Gender:</strong> {user.gender}</p>
                                <p><strong>Weight:</strong> {user.weight}</p>
                                <p><strong>Height:</strong> {user.height}</p>
                                <p><strong>Age:</strong> {user.age}</p>
                                <p><strong>Payments:</strong></p>
                                <ul className="list-disc pl-6">
                                    {user.payments && user.payments.length > 0 ? (
                                        user.payments.map((payment, idx) => (
                                            <li key={idx}>
                                                {payment.entryDate} - {payment.salary}₺ -{" "}
                                                {payment.paymentStatus ? "Ödendi ✅" : "Beklemede ⏳"}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Ödeme yok</li>
                                    )}
                                </ul>
                                <button onClick={() => openModal(user)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Güncelle</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AddUserModal isOpen={addModalOpen} onClose={closeModal} />
            <UserModal isOpen={modalOpen} onClose={closeModal} selectedUser={selectedUser} />
        </div>
    )
}

export default UsersTable