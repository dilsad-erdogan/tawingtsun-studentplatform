import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "./firebase";

export const addTrainers = async (data) => {
  try {
    const trainersRef = collection(firestore, "trainers");
    const newTrainer = {
      userId: data.userId || "",
      gymId: data.gymId || "",
      totalSalaryMonth: 0
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

export const deleteTrainerByUserAndGym = async (userId, gymId) => {
  try {
    const trainersRef = collection(firestore, "trainers");
    const q = query(trainersRef, where("userId", "==", userId), where("gymId", "==", gymId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Silinecek trainer bulunamadı");
      return false;
    }

    // eşleşen tüm kayıtları sil
    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(firestore, "trainers", document.id));
      console.log("Trainer silindi:", document.id);
    }

    return true;
  } catch (error) {
    console.error("Trainer silinirken hata:", error);
    return false;
  }
};

export const deleteAllTrainersByUser = async (userId) => {
  try {
    const trainersRef = collection(firestore, "trainers");
    const q = query(trainersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Silinecek trainer bulunamadı.");
      return false;
    }

    // eşleşen tüm kayıtları sil
    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(firestore, "trainers", document.id));
      console.log("Trainer silindi:", document.id);
    }

    return true;
  } catch (error) {
    console.error("Trainer silinirken hata:", error);
    return false;
  }
};

export const deleteTrainerById = async (trainerDocId) => {
  try {
    await deleteDoc(doc(firestore, "trainers", trainerDocId));
    console.log("Trainer silindi:", trainerDocId);
    return true;
  } catch (error) {
    console.error("Trainer silinirken hata:", error);
    return false;
  }
};