import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "./firebase";

import toast from "react-hot-toast";

export const addTrainers = async (data) => {
  try {
    const trainersRef = collection(firestore, "trainers");
    const newTrainer = {
      userId: data.userId || "",
      gymId: data.gymId || "",
      totalSalaryMonth: 0
    };

    const docRef = await addDoc(trainersRef, newTrainer);
    toast.success("Yeni kullanıcı eklendi:", docRef.id);

    return { id: docRef.id, ...newTrainer };
  } catch (error) {
    toast.error("Trainer eklenirken hata:", error);
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
    toast.error("Error while withdrawing trainers:", error);
    return [];
  }
};

export const deleteTrainerByUserAndGym = async (userId, gymId) => {
  try {
    const trainersRef = collection(firestore, "trainers");
    const q = query(trainersRef, where("userId", "==", userId), where("gymId", "==", gymId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("Silinecek trainer bulunamadı");
      return false;
    }

    // eşleşen tüm kayıtları sil
    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(firestore, "trainers", document.id));
      toast.success("Trainer silindi:", document.id);
    }

    return true;
  } catch (error) {
    toast.error("Trainer silinirken hata:", error);
    return false;
  }
};

export const deleteAllTrainersByUser = async (userId) => {
  try {
    const trainersRef = collection(firestore, "trainers");
    const q = query(trainersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("Silinecek trainer bulunamadı.");
      return false;
    }

    // eşleşen tüm kayıtları sil
    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(firestore, "trainers", document.id));
      toast.success("Trainer silindi:", document.id);
    }

    return true;
  } catch (error) {
    toast.error("Trainer silinirken hata:", error);
    return false;
  }
};

export const deleteTrainerById = async (trainerDocId) => {
  try {
    await deleteDoc(doc(firestore, "trainers", trainerDocId));
    toast.success("Trainer silindi:", trainerDocId);
    return true;
  } catch (error) {
    toast.error("Trainer silinirken hata:", error);
    return false;
  }
};