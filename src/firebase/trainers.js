import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

export const addTrainers = async (data) => {
  try {
    const trainersRef = collection(firestore, "trainers");
    const newTrainer = {
      userId: data.userId || "",
      gymId: data.gymId || "",
      totalSalaryMonth: data.totalSalaryMonth || 0,
      isActive: true
    };

    const docRef = await addDoc(trainersRef, newTrainer);
    console.log("Yeni kullanıcı eklendi:", docRef.id);

    return { id: docRef.id, ...newTrainer };
  } catch (error) {
    console.error("Trainer eklenirken hata:", error);
    return null;
  }
};

export const getAllTrainer = async () => {
  try {
    const trainersRef = collection(firestore, "trainers");
    const querySnapshot = await getDocs(trainersRef);

    const trainers = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data()
    }));

    return trainers;
  } catch (error) {
    console.error("Error while withdrawing trainers:", error);
    return [];
  }
};