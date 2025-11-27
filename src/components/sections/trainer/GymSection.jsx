
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGymById } from "../../../redux/gymSlice";
import { Users, UserRoundX, UserPlus, UserMinus } from "lucide-react";

const GymSection = ({ gymId }) => {
  const dispatch = useDispatch();
  const { gym, loading: gymLoading } = useSelector((state) => state.gym);
  const { students } = useSelector((state) => state.student);

  useEffect(() => {
    if (gymId) {
      dispatch(fetchGymById(gymId));
    }
  }, [dispatch, gymId]);

  if (gymLoading || !gym) {
    return <div className="p-4">Salon bilgileri yükleniyor...</div>;
  }

  // --- İstatistik Hesaplama ---
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const convertTimestamp = (ts) => {
    if (!ts) return null;
    if (ts instanceof Date) return ts;
    if (typeof ts === "string") return new Date(ts);
    if (ts.seconds) return new Date(ts.seconds * 1000);
    return null;
  };

  // Sadece bu salona ait öğrencileri filtrele
  const gymStudents = students.filter((s) => s.gymId === gymId);

  const activeStudents = gymStudents.filter((s) => s.isActive === true);
  const monthlyNew = activeStudents.filter((s) => {
    const registerDate = convertTimestamp(s.date);
    return registerDate && registerDate >= oneMonthAgo;
  }).length;

  const passiveStudents = gymStudents.filter((s) => s.isActive === false);
  const monthlyExpired = passiveStudents.filter((s) => {
    const registerDate = convertTimestamp(s.date);
    if (!registerDate) return false;

    // Bitiş tarihi = kayıt + studyPeriod ay
    const endDate = new Date(registerDate);
    endDate.setMonth(endDate.getMonth() + s.studyPeriod);

    return endDate >= oneMonthAgo && endDate <= now;
  }).length;

  const stats = [
    {
      label: "Toplam aktif öğrenci",
      value: activeStudents.length,
      icon: <Users className="text-red-600 w-8 h-8" />,
    },
    {
      label: "Toplam pasif öğrenci",
      value: passiveStudents.length,
      icon: <UserRoundX className="text-red-600 w-8 h-8" />,
    },
    {
      label: "Aylık yeni kayıt",
      value: monthlyNew,
      icon: <UserPlus className="text-red-600 w-8 h-8" />,
    },
    {
      label: "Aylık kaydı bitenler",
      value: monthlyExpired,
      icon: <UserMinus className="text-red-600 w-8 h-8" />,
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Salon Bilgileri */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{gym.name}</h2>
        <p className="text-gray-600">
          <strong>Adres:</strong> {gym.address}
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-all border border-gray-100"
          >
            <div>
              <p className="text-gray-500 text-sm font-medium">{item.label}</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">
                {item.value}
              </h2>
            </div>
            <div className="bg-red-100 rounded-full p-3">{item.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymSection;
