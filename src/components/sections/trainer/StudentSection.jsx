import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTrainerGymsWithStudents } from "../../../firebase/students";
import { updatePaymentStatus, addPaymentToUser } from "../../../firebase/users";
import toast from "react-hot-toast";
import AddUserModal from "../../modals/addModals/userFromTrainer";

const StudentSection = () => {
  const user = useSelector((state) => state.user.data);
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [salaryInput, setSalaryInput] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchGyms = async () => {
      try {
        const gymsData = await getTrainerGymsWithStudents(user.id);
        setGyms(gymsData);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [user]);

  const refreshGyms = async () => {
    const gymsData = await getTrainerGymsWithStudents(user.id);
    setGyms(gymsData);
  };

  const handlePayment = async (entryDate, id) => {
    try {
      await updatePaymentStatus(id, entryDate);
      await refreshGyms();
    } catch (error) {
      toast.error("Ödeme güncellenemedi:", error);
    }
  };

  const handleAddPayment = async () => {
    if (!salaryInput || !selectedUserId) return;

    try {
      await addPaymentToUser(selectedUserId, salaryInput);
      toast.success("Yeni ödeme eklendi ✅");
      setSalaryInput("");
      setIsModalOpen(false);
      await refreshGyms();
    } catch (error) {
      toast.error("Ödeme eklenemedi:", error);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Öğrencilerin ve Ödeme Durumları</h2>
      {gyms.length === 0 ? (
        <p>Hiçbir salona bağlı değilsiniz.</p>
      ) : (
        gyms.map((gym) => (
          <div key={gym.gymId} className="mb-6 border rounded p-4 bg-white shadow">
            <h3 className="font-semibold mb-2 flex justify-between items-center">
              {gym.gymName}
              <button onClick={() => setSelectedGym(gym)} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                Öğrenci Ekle
              </button>
            </h3>

            {selectedGym && (
              <AddUserModal isOpen={!!selectedGym} onClose={() => setSelectedGym(null)} gym={selectedGym} />
            )}

            {gym.students.length === 0 ? (
              <p>Bu salonda öğrenci yok.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Öğrenci Adı</th>
                    <th className="border px-2 py-1">Email</th>
                    <th className="border px-2 py-1">Ücret</th>
                    <th className="border px-2 py-1">Tarih</th>
                    <th className="border px-2 py-1">Ödenme Durumu</th>
                  </tr>
                </thead>
                <tbody>
                  {gym.students.map((student) => {
                    // Ödemeleri tarihe göre sırala (en yeni en başta)
                    const sortedPayments = [...student.user.payments].sort(
                      (a, b) => new Date(b.entryDate) - new Date(a.entryDate)
                    );

                    // Sadece en güncel ödeme
                    const latestPayment = sortedPayments[0];

                    return (
                      <tr key={student.userId}>
                        <td className="border px-2 py-1">{student.user.name}</td>
                        <td className="border px-2 py-1">{student.user.email}</td>
                        <td className="border px-2 py-1">{latestPayment ? latestPayment.salary : "Ödeme yok"}</td>
                        <td className="border px-2 py-1">{latestPayment ? latestPayment.entryDate : "-"}</td>
                        <td className="border px-2 py-1 text-center">
                          {latestPayment ? (
                            latestPayment.paymentStatus ? (
                              <button onClick={() => {
                                  setSelectedUserId(student.userId);
                                  setIsModalOpen(true);
                                }} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                Yeni Ödeme Ekle
                              </button>
                            ) : (
                              <button onClick={() =>
                                  handlePayment(latestPayment.entryDate, student.userId)
                                } className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                Ödendi
                              </button>
                            )
                          ) : (
                            <button onClick={() => {
                                setSelectedUserId(student.userId);
                                setIsModalOpen(true);
                              }} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                              İlk Ödeme Ekle
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 text-black backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-4">Yeni Ödeme Ekle</h2>
            <input type="number" placeholder="Ücret" value={salaryInput} onChange={(e) => setSalaryInput(e.target.value)} className="w-full border px-3 py-2 mb-4 rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">İptal</button>
              <button onClick={handleAddPayment} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSection;