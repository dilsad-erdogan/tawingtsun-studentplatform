import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";
import toast from "react-hot-toast";

export const getAllStudent = async () => {
  try {
    const studentsRef = collection(firestore, "students");
    const querySnapshot = await getDocs(studentsRef);

    const students = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data()
    }));

    return students;
  } catch (error) {
    toast.error("Error while withdrawing students:", error);
    return [];
  }
};