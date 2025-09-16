import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTrainerGymsWithStudents } from "../../firebase/students";

const StudentSection = () => {
  const user = useSelector((state) => state.user.data);
  const [gymsWithStudents, setGymsWithStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const data = await getTrainerGymsWithStudents(user.id);
        setGymsWithStudents(data);
      } catch (err) {
        console.error("StudentSection fetchData Hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Eğitmen Olduğun Öğrenciler</h2>
      {gymsWithStudents.length === 0 ? (
        <p>Hiç öğrenci bulunamadı.</p>
      ) : (
        gymsWithStudents.map((gym) => (
          <div
            key={gym.gymId}
            className="mb-6 border rounded p-4 bg-white shadow"
          >
            <h3 className="text-lg font-semibold mb-3">{gym.gymName}</h3>

            {gym.students.length === 0 ? (
              <p>Bu salonda öğrenci yok.</p>
            ) : (
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Ad Soyad</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Telefon</th>
                    <th className="p-2 border">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {gym.students.map((student) => (
                    <tr key={student.id} className="text-center">
                      <td className="p-2 border">{student.user?.name}</td>
                      <td className="p-2 border">{student.user?.email}</td>
                      <td className="p-2 border">{student.user?.phone}</td>
                      <td className="p-2 border">
                        {student.isActive ? "Aktif" : "Pasif"}
                      </td>
                    </tr>
                  ))}
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