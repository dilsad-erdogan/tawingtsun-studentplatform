import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 
import { getGymsForTrainer } from "../../../firebase/gyms";

const GymSection = () => {
  const user = useSelector((state) => state.user.data);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Eğitmen Olduğun Salonlar</h2>
      {gyms.length === 0 ? (
        <p>Hiçbir salona bağlı değilsiniz.</p>
      ) : (
        <ul className="space-y-2">
          {gyms.map((gym) => (
            <li key={gym.id} className="border rounded p-3 bg-white shadow">
              <h3 className="font-semibold">{gym.name}</h3>
              <p><strong>Adres:</strong> {gym.address}</p>
              <p><strong>Senin Aylık Kazancın:</strong> {gym.trainerSalary}</p>
              <p><strong>Spor Salonunun Aylık Kazancı:</strong> {gym.totalSalaryMonth}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GymSection;