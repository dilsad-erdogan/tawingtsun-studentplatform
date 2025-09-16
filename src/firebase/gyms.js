import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "./firebase";

import toast from "react-hot-toast";

export const getAllGyms = async () => {
  try {
    const gymsRef = collection(firestore, "gyms");
    const querySnapshot = await getDocs(gymsRef);

    const gyms = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data()
    }));

    return gyms;
  } catch (error) {
    toast.error("Error while withdrawing gyms:", error);
    return [];
  }
};

export const updateGymByID = async (id, updatedData) => {
  try {
    const gymRef = doc(firestore, "gyms", id);
    await updateDoc(gymRef, updatedData);
    toast.success("Gym updated successfully!");
    return true;
  } catch (error) {
    toast.error("Error updating gym:", error);
    return false;
  }
};

export const addOwnsToGym = async (gymId, userId) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      ownUser: arrayUnion(userId),
    });

    toast.success("Kullanıcı başarıyla eklendi:", userId);
    return true;
  } catch (error) {
    toast.error("Kullanıcı eklenirken hata:", error);
    return false;
  }
};

export const removeOwn = async (gymId, userId) => {
  try{
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      ownUser: arrayRemove(userId),
    });

    toast.success("Kullanıcı başarıyla silindi");
    return true;
  } catch (error){
    toast.error("Kullanıcı silinirken hata:", error);
    return false;
  }
};

export const addTrainersToGym = async (gymId, userId) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      trainers: arrayUnion(userId),
    });

    toast.success("Kullanıcı başarıyla eklendi:", userId);
    return true;
  } catch (error) {
    toast.error("Kullanıcı eklenirken hata:", error);
    return false;
  }
};

export const removeTrainer = async (gymId, userId) => {
  try{
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      trainers: arrayRemove(userId),
    });

    toast.success("Kullanıcı başarıyla silindi");
    return true;
  } catch (error){
    toast.error("Kullanıcı silinirken hata:", error);
    return false;
  }
};

export const addGyms = async (gymData) => {
  try {
    const gymsRef = collection(firestore, "gyms");

    const newGym = {
      name: gymData.name || "",
      address: gymData.address || "",
      ownUser: [],
      students: [],
      trainers: [],
      totalSalaryMonth: 0,
      isActive: true
    };

    const docRef = await addDoc(gymsRef, newGym);
    toast.success("Yeni salon eklendi:", docRef.id);

    return { id: docRef.id, ...newGym };
  } catch (error) {
    toast.error("Salon eklenirken hata:", error);
    return null;
  }
};

export const getGymsForTrainer = async (userId) => {
  try {
    // 1. Bu user'a bağlı trainer kayıtlarını bul
    const trainersRef = collection(firestore, "trainers");
    const q = query(trainersRef, where("userId", "==", userId));
    const trainerSnap = await getDocs(q);

    if (trainerSnap.empty) return [];

    const gymsData = [];

    // 2. Trainer kayıtlarını dolaş
    for (let trainerDoc of trainerSnap.docs) {
      const { gymId, totalSalaryMonth: trainerSalary } = trainerDoc.data();

      // 3. Gym bilgisini çek
      const gymRef = doc(firestore, "gyms", gymId);
      const gymSnap = await getDoc(gymRef);

      if (gymSnap.exists()) {
        gymsData.push({
          id: gymSnap.id,
          ...gymSnap.data(),
          trainerSalary,
        });
      }
    }

    return gymsData;
  } catch (error) {
    console.error("Hata (getGymsForTrainer):", error);
    throw error;
  }
};