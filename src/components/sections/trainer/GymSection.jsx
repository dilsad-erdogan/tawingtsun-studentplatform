import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 
import { getGymsForTrainer } from "../../../firebase/gyms";

const GymSection = () => {
  const user = useSelector((state) => state.user.data);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openGym, setOpenGym] = useState(null); // hangi gym expand edilmiş?

  useEffect(() => {
    if (!user?.id) return;

    const fetchGyms = async () => {
      try {
        const gymsData = await getGymsForTrainer(user.id);
        setGyms(gymsData);
      } catch (error) {
        console.error("GymSection fetchGyms Hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [user]);

  if (loading) return <p>Yükleniyor...</p>;

  // 🔹 Yardımcı: Array'i tarihe göre sıralayıp sonuncuyu al
  const getLatestRecord = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return [...arr].sort((a, b) => (a.month < b.month ? 1 : -1))[0];
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Eğitmen Olduğun Salonlar</h2>
      {gyms.length === 0 ? (
        <p>Hiçbir salona bağlı değilsiniz.</p>
      ) : (
        <ul className="space-y-2">
          {gyms.map((gym) => {
            const latestTrainerSalary = getLatestRecord(gym.trainerSalary);
            const latestGymSalary = getLatestRecord(gym.totalSalaryMonth);

            return (
              <li key={gym.id} className="border rounded p-3 bg-white shadow">
                <h3 className="font-semibold">{gym.name}</h3>
                <p><strong>Adres:</strong> {gym.address}</p>

                <p>
                  <strong>Senin Güncel Kazancın:</strong>{" "}
                  {latestTrainerSalary ? `${latestTrainerSalary.total}₺ (${latestTrainerSalary.month})` : "-"}
                </p>
                <p>
                  <strong>Salonun Güncel Kazancı:</strong>{" "}
                  {latestGymSalary ? `${latestGymSalary.total}₺ (${latestGymSalary.month})` : "-"}
                </p>

                {/* Açılır Liste Butonu */}
                {(gym.trainerSalary?.length > 1 || gym.totalSalaryMonth?.length > 1) && (
                  <button
                    onClick={() => setOpenGym(openGym === gym.id ? null : gym.id)}
                    className="mt-2 text-blue-600 underline text-sm"
                  >
                    {openGym === gym.id ? "Kapat" : "Geçmişi Görüntüle"}
                  </button>
                )}

                {/* Geçmiş kayıtları */}
                {openGym === gym.id && (
                  <div className="mt-2 p-2 border-t text-sm space-y-1">
                    <p className="font-semibold">Senin Kazanç Geçmişin:</p>
                    {gym.trainerSalary
                      ?.sort((a, b) => (a.month < b.month ? 1 : -1))
                      .map((s, idx) => (
                        <p key={idx}>
                          {s.month}: {s.total}₺
                        </p>
                      ))}

                    <p className="font-semibold mt-2">Salon Kazanç Geçmişi:</p>
                    {gym.totalSalaryMonth
                      ?.sort((a, b) => (a.month < b.month ? 1 : -1))
                      .map((s, idx) => (
                        <p key={idx}>
                          {s.month}: {s.total}₺
                        </p>
                      ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GymSection;