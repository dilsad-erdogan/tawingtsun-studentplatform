import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
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