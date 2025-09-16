import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 
import { getDocs, collection, query, where, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase"; 

const GymSection = () => {
    const user = useSelector((state) => state.user.data);
    console.log(user)
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) return;

        const fetchGymsForTrainer = async () => {
            try {
                // 1. Bu user'a bağlı trainer kayıtlarını bul
                const trainersRef = collection(firestore, "trainers");
                const q = query(trainersRef, where("userId", "==", user.id));
                const trainerSnap = await getDocs(q);

                if (trainerSnap.empty) {
                    setGyms([]);
                    setLoading(false);
                    return;
                }

                // 2. GymId'leri al
                const gymIds = trainerSnap.docs.map((doc) => doc.data().gymId);

                // 3. Gym bilgilerini çek
                const gymsData = [];
                for (let gid of gymIds) {
                    const gymRef = doc(firestore, "gyms", gid);
                    const gymSnap = await getDoc(gymRef);
                    if (gymSnap.exists()) {
                        gymsData.push({ id: gymSnap.id, ...gymSnap.data() });
                    }
                }

                setGyms(gymsData);
            } catch (error) {
                console.error("Hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGymsForTrainer();
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
                            <p><strong>Aylık Toplam Maaş:</strong> {gym.totalSalaryMonth}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GymSection