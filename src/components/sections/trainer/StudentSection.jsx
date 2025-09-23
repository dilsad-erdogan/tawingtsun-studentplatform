import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTrainerGymsWithStudents } from "../../../firebase/students";
import { updatePaymentStatus, addPaymentToUser } from "../../../firebase/users";
import toast from "react-hot-toast";
import AddUserModal from "../../modals/addModals/userFromTrainer";
import { addSalaryToTrainer } from "../../../firebase/trainers";
import { addSalaryToGym } from "../../../firebase/gyms";

const StudentSection = () => {
  const user = useSelector((state) => state.user.data);
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerms, setSearchTerms] = useState({});
  const [expandedStudents, setExpandedStudents] = useState(new Set());

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

  // const handlePayment = async (entryDate, id) => {
  //   try {
  //     await updatePaymentStatus(id, entryDate);
  //     await refreshGyms();
  //   } catch (error) {
  //     toast.error("Ödeme güncellenemedi:", error);
  //   }
  // };

  const handlePayment = async (entryDate, student) => {
    try {
      const payment = await updatePaymentStatus(student.userId, entryDate);
      console.log(payment)

      await addSalaryToTrainer(student.trainerId, payment.salary);
      await addSalaryToGym(student.gymId, payment.salary);

      await refreshGyms();
    } catch (error) {
      toast.error("Ödeme güncellenemedi: " + error.message);
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

  // toggle fonksiyonu
  const toggleExpand = (studentId) => {
    setExpandedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Öğrencilerin ve Ödeme Durumları</h2>
      {gyms.length === 0 ? (
        <p>Hiçbir salona bağlı değilsiniz.</p>
      ) : (
        gyms.map((gym) => {
          const searchValue = searchTerms[gym.gymId] || "";

          // Öğrenci arama filtresi
          const filteredStudents = gym.students.filter((student) =>
            student.user.name
              ?.toLocaleLowerCase("tr")
              .includes(searchValue.trim().toLocaleLowerCase("tr"))
          );

          return (
            <div key={gym.gymId} className="mb-6 border rounded p-4 bg-white shadow">
              <div className="flex justify-between items-center mb-2 gap-4">
                <h3 className="font-semibold text-lg">{gym.gymName}</h3>
                <input type="text" placeholder="Öğrenci adına göre ara..." value={searchValue} onChange={(e) => setSearchTerms((prev) => ({...prev, [gym.gymId]: e.target.value}))} className="border px-3 py-1 rounded w-60" />
                <button onClick={() => setSelectedGym(gym)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Öğrenci Ekle
                </button>
              </div>

              {selectedGym && (
                <AddUserModal isOpen={!!selectedGym} onClose={() => setSelectedGym(null)} gym={selectedGym} />
              )}

              {/* Öğrenci tablosu */}
              {filteredStudents.length === 0 ? (
                <p>Bu salonda öğrenci bulunamadı.</p>
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
                    {filteredStudents.map((student) => {
                      const sortedPayments = [...student.user.payments].sort(
                        (a, b) => new Date(b.entryDate) - new Date(a.entryDate)
                      );
                      const latestPayment = sortedPayments[0];
                      const isExpanded = expandedStudents.has(student.userId);

                      return (
                        <React.Fragment key={student.userId}>
                          <tr onClick={() => toggleExpand(student.userId)} className="cursor-pointer hover:bg-gray-50">
                            <td className="border px-2 py-1">{student.user.name}</td>
                            <td className="border px-2 py-1">{student.user.email}</td>
                            <td className="border px-2 py-1">{latestPayment ? latestPayment.salary : "Ödeme yok"}</td>
                            <td className="border px-2 py-1">{latestPayment ? latestPayment.entryDate : "-"}</td>
                            <td className="border px-2 py-1 text-center">
                              {latestPayment ? (
                                latestPayment.paymentStatus ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedUserId(student.userId);
                                      setIsModalOpen(true);
                                    }}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                  >
                                    Yeni Ödeme Ekle
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePayment(latestPayment.entryDate, {
                                        userId: student.userId,
                                        trainerId: student.trainerId,
                                        gymId: gym.gymId,
                                      });
                                    }}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  >
                                    Ödendi
                                  </button>
                                )
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUserId(student.userId);
                                    setIsModalOpen(true);
                                  }}
                                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                >
                                  İlk Ödeme Ekle
                                </button>
                              )}
                            </td>
                          </tr>

                          {/* Ödeme geçmişi satırı */}
                          {isExpanded && sortedPayments.length > 0 && (
                            <tr>
                              <td colSpan={5} className="border px-2 py-2 bg-gray-50">
                                <h4 className="font-semibold mb-2">Ödeme Geçmişi</h4>
                                <table className="w-full text-sm border">
                                  <thead>
                                    <tr className="bg-gray-100">
                                      <th className="border px-2 py-1">Tarih</th>
                                      <th className="border px-2 py-1">Miktar</th>
                                      <th className="border px-2 py-1">Durum</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sortedPayments.map((p, idx) => (
                                      <tr key={idx}>
                                        <td className="border px-2 py-1">{p.entryDate}</td>
                                        <td className="border px-2 py-1">{p.salary}</td>
                                        <td className="border px-2 py-1">
                                          {p.paymentStatus ? "Ödendi ✅" : "Bekliyor ⏳"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
      )}

      {/* Ödeme modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 text-black backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-4">Yeni Ödeme Ekle</h2>
            <input type="number" placeholder="Ücret" value={salaryInput} onChange={(e) => setSalaryInput(e.target.value)} className="w-full border px-3 py-2 mb-4 rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                İptal
              </button>
              <button onClick={handleAddPayment} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSection;