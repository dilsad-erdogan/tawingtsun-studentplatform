import { arrayRemove, arrayUnion, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "./firebase";

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
    console.error("Error while withdrawing gyms:", error);
    return [];
  }
};

export const updateGymByID = async (id, updatedData) => {
  try {
    const gymRef = doc(firestore, "gyms", id);
    await updateDoc(gymRef, updatedData);
    console.log("Gym updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating gym:", error);
    return false;
  }
};

export const addOwnsToGym = async (gymId, userId) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      ownUser: arrayUnion(userId),
    });

    console.log("Kullanıcı başarıyla eklendi:", userId);
    return true;
  } catch (error) {
    console.error("Kullanıcı eklenirken hata:", error);
    return false;
  }
};

export const handleRemoveOwn = async (gymId, selectedOwnerToRemove) => {
  try{
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      ownUser: arrayRemove(selectedOwnerToRemove),
    });

    console.log("Kullanıcı başarıyla silindi");
    return true;
  } catch (error){
    console.error("Kullanıcı silinirken hata:", error);
    return false;
  }
};