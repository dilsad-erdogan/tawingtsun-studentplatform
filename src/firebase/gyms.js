import { collection, getDocs } from "firebase/firestore";
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