import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStudentTrainerAndGym } from "../../../firebase/students";

const InfoSection = () => {
  const user = useSelector((state) => state.user.data);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const data = await getStudentTrainerAndGym(user.id);
        setInfo(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  if (!info) return <p>Yükleniyor...</p>;
  if (info.message) return <p>{info.message}</p>;

  return (
    <div className="m-10 p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Bilgilerim</h2>

      {/* 🔹 User main info */}
      <div className="flex m-4 gap-10">
        <div className="border-r p-5 pr-10">
          <p><strong>Ad Soyad:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Telefon:</strong> {user?.phone}</p>
        </div>
        <div className="p-5">
          <div className="flex gap-5">
            <p><strong>Yaş:</strong> {user?.age}</p>
            <p><strong>Cinsiyet:</strong> {user?.gender === "male" ? "Erkek" : "Kadın"}</p>
          </div>
          <div className="flex gap-5">
            <p><strong>Boy:</strong> {user?.height} cm</p>
            <p><strong>Kilo:</strong> {user?.weight} kg</p>
          </div>
          <p><strong>Durum:</strong> {user?.isActive ? "Aktif" : "Pasif"}</p>
        </div>
      </div>

      <hr className="my-4" />

      {/* 🔹 User other data */}
      <div className="p-5 m-4">
        <p><strong>Eğitmen:</strong> {info.trainer?.user?.name} ({info.trainer?.user?.email})</p>
        <p><strong>Salon:</strong> {info.gym?.name}</p>
        <p><strong>Salon Adresi:</strong> {info.gym?.address}</p>        
      </div>
    </div>
  );
};

export default InfoSection;