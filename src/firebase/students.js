import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

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
    console.error("Error while withdrawing students:", error);
    return [];
  }
};