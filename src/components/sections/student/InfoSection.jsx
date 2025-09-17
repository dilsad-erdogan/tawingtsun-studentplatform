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

  return (
    <div className="m-10 p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Bilgilerim</h2>

      <p><strong>Öğrenci:</strong> {info.student?.name || user?.name}</p>
      <p><strong>Eğitmen:</strong> {info.trainer?.user?.name} ({info.trainer?.user?.email})</p>
      <p><strong>Salon:</strong> {info.gym?.name}</p>
      <p><strong>Salon Adresi:</strong> {info.gym?.address}</p>
    </div>
  );
};

export default InfoSection;