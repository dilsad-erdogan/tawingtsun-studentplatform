import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
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

export const getAllTrainersWithDetails = async () => {
  const trainersRef = collection(firestore, "trainers");
  const trainersSnap = await getDocs(trainersRef);

  const trainersData = await Promise.all(
    trainersSnap.docs.map(async (trainerDoc) => {
      const trainer = { id: trainerDoc.id, ...trainerDoc.data() };

      // User bilgisini getir
      let userData = {};
      if (trainer.userId) {
        const userRef = doc(firestore, "users", trainer.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          userData = { id: userSnap.id, ...userSnap.data() };
        }
      }

      // Gym bilgisini getir
      let gymData = {};
      if (trainer.gymId) {
        const gymRef = doc(firestore, "gyms", trainer.gymId);
        const gymSnap = await getDoc(gymRef);
        if (gymSnap.exists()) {
          gymData = { id: gymSnap.id, ...gymSnap.data() };
        }
      }

      return {
        ...trainer,
        user: userData,
        gym: gymData,
      };
    })
  );

  return trainersData;
};

export const addSalaryToTrainer = async (trainerId, amount) => {
  try {
    const trainerRef = doc(firestore, "trainers", trainerId);

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) throw new Error("Geçersiz ödeme miktarı");

    await updateDoc(trainerRef, {
      totalSalaryMonth: increment(numericAmount),
    });
  } catch (error) {
    console.error("addSalaryToTrainer hata:", error);
    throw error;
  }
};