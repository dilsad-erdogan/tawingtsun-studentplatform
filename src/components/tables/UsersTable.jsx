import { useState } from "react";
import UserModal from "../modals/updateModals/userModal";
import AddUserModal from "../modals/addModals/userModal";
import { Filter } from "lucide-react";

const UsersTable = ({ users }) => {
    const [openUserId, setOpenUserId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);

    const [filterRole, setFilterRole] = useState("");
    const [filterGender, setFilterGender] = useState("");
    const [filterWeightMin, setFilterWeightMin] = useState("");
    const [filterWeightMax, setFilterWeightMax] = useState("");
    const [filterHeightMin, setFilterHeightMin] = useState("");
    const [filterHeightMax, setFilterHeightMax] = useState("");
    const [filterAgeMin, setFilterAgeMin] = useState("");
    const [filterAgeMax, setFilterAgeMax] = useState("");

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

    const openAddModal = () => {
        setAddModalOpen(true);
    };

    const filteredUsers = users.filter((user) => {
        const matchesName = user.name.toLocaleLowerCase("tr").includes(searchTerm.trim().toLocaleLowerCase("tr"));
        const matchesRole = filterRole ? user.role === filterRole : true;
        const matchesGender = filterGender ? user.gender === filterGender : true;

        const matchesWeight =
            (!filterWeightMin || user.weight >= filterWeightMin) &&
            (!filterWeightMax || user.weight <= filterWeightMax);

        const matchesHeight =
            (!filterHeightMin || user.height >= filterHeightMin) &&
            (!filterHeightMax || user.height <= filterHeightMax);

        const matchesAge =
            (!filterAgeMin || user.age >= filterAgeMin) &&
            (!filterAgeMax || user.age <= filterAgeMax);

        return matchesName && matchesRole && matchesGender && matchesWeight && matchesHeight && matchesAge;
    });

    return (
        <div className={`grid gap-4 transition-all duration-300 ${filterOpen ? "lg:grid-cols-[1fr_300px]" : "lg:grid-cols-1"} grid-cols-1`}>
            {/* Main table */}
            <div className="p-6 max-w-2xl mx-auto w-full">
                <div className="flex justify-between items-center mb-4 gap-2">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={openAddModal} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Kullanıcı Ekle
                        </button>
                        <button onClick={() => setFilterOpen(!filterOpen)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1">
                            <Filter size={18} />
                        </button>
                        <input type="text" placeholder="İsme göre ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded w-48" />
                    </div>
                </div>

                <div className="space-y-2">
                    {filteredUsers.map((user) => (
                        <div key={user.uid} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                            <button onClick={() => toggleUser(user.uid)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                                <span>{user.name} {user.surname}</span>
                                <span>{openUserId === user.uid ? "▲" : "▼"}</span>
                            </button>

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
                                    <button onClick={() => openModal(user)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Güncelle
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <AddUserModal isOpen={addModalOpen} onClose={closeModal} />
                <UserModal isOpen={modalOpen} onClose={closeModal} selectedUser={selectedUser} />
            </div>

            {/* Right section */}
            {filterOpen && (
                <div className="p-4 bg-white shadow-lg border rounded h-fit w-64">
                    <h2 className="text-lg font-semibold mb-4">Filtreler</h2>

                    {/* Role Filter */}
                    <div className="mb-3">
                        <label className="block text-sm mb-1">Role</label>
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full border px-2 py-1 rounded">
                            <option value="">Hepsi</option>
                            <option value="admin">Admin</option>
                            <option value="trainer">Trainer</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    {/* Gender Filter */}
                    <div className="mb-3">
                        <label className="block text-sm mb-1">Gender</label>
                        <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="w-full border px-2 py-1 rounded">
                            <option value="">Hepsi</option>
                            <option value="male">Erkek</option>
                            <option value="female">Kadın</option>
                        </select>
                    </div>

                    {/* Weight Filter */}
                    <div className="mb-3">
                        <label className="block text-sm mb-1">Weight (kg)</label>
                        <div className="flex gap-2">
                            <input type="number" placeholder="Min" value={filterWeightMin} onChange={(e) => setFilterWeightMin(e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                            <input type="number" placeholder="Max" value={filterWeightMax} onChange={(e) => setFilterWeightMax(e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                        </div>
                    </div>

                    {/* Height Filter */}
                    <div className="mb-3">
                        <label className="block text-sm mb-1">Height (cm)</label>
                        <div className="flex gap-2">
                            <input type="number" placeholder="Min" value={filterHeightMin} onChange={(e) => setFilterHeightMin(e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                            <input type="number" placeholder="Max" value={filterHeightMax} onChange={(e) => setFilterHeightMax(e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                        </div>
                    </div>

                    {/* Age Filter */}
                    <div className="mb-3">
                        <label className="block text-sm mb-1">Age</label>
                        <div className="flex gap-2">
                            <input type="number" placeholder="Min" value={filterAgeMin} onChange={(e) => setFilterAgeMin(e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                            <input type="number" placeholder="Max" value={filterAgeMax} onChange={(e) => setFilterAgeMax(e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTable;