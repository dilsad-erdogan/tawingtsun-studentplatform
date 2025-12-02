import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, firestore } from "./firebase";
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
    console.error("getAllGyms error:", error);
    toast.error("Spor salonlarından çekilirken hata oluştu.");
    return [];
  }
}; //kullandım

export const addGyms = async (gymData) => {
  try {
    const gymsRef = collection(firestore, "gyms");

    const newGym = {
      name: gymData.name || "",
      address: gymData.address || "",
      isActive: false
    };

    const docRef = await addDoc(gymsRef, newGym);
    toast.success("Yeni salon eklendi.");

    return { id: docRef.id, ...newGym };
  } catch (error) {
    console.error("addGyms error:", error);
    toast.error("Salon eklenirken hata.");
    return null;
  }
}; //kullandım

export const updateGymActiveStatus = async (gymId, isActive) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);
    await updateDoc(gymRef, { isActive });
    return true;
  } catch (error) {
    console.error("GYM STATUS UPDATE ERROR:", error);
    throw error;
  }
}; //kullandım

export const getGymById = async (id) => {
  try {
    const ref = doc(firestore, "gyms", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };

  } catch (error) {
    console.error("getGymById Error:", error);
    throw error;
  }
};//kullandım

export const updateGymByID = async (id, updatedData) => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Oturum açmanız gerekiyor!");
    return false;
  }

  try {
    const gymRef = doc(firestore, "gyms", id);
    await updateDoc(gymRef, updatedData);
    toast.success("Salon başarıyla güncellendi!");
    return true;
  } catch (error) {
    console.error("updateGymByID error:", error);
    toast.error("Salon güncellenemedi");
    return false;
  }
};//kullandım