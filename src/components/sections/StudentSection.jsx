import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTrainerGymsWithStudents } from "../../firebase/students";

const StudentSection = () => {
  const user = useSelector((state) => state.user.data);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handlePayment = (gymId, studentId) => {
    // Burada Firebase'de paymentStatus: true olarak güncelle
    console.log("Ödendi olarak işaretlenecek:", gymId, studentId);
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
            <h3 className="font-semibold mb-2">{gym.gymName}</h3>

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
                  {gym.students.map((student) =>
                    student.user.payments.map((payment, idx) => (
                      <tr key={student.userId + idx}>
                        <td className="border px-2 py-1">{student.user.name}</td>
                        <td className="border px-2 py-1">{student.user.email}</td>
                        <td className="border px-2 py-1">{payment.salary}</td>
                        <td className="border px-2 py-1">{payment.entryDate}</td>
                        <td className="border px-2 py-1 text-center">
                          {payment.paymentStatus ? (
                            "✅"
                          ) : (
                            <button onClick={() => handlePayment(gym.gymId, student.userId)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                              Ödendi
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentSection;