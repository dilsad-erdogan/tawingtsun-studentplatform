import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
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

export const getTrainerGymsWithStudents = async (userId) => {
  try {
    // 1. Trainer kayıtlarını bul
    const trainersRef = collection(firestore, "trainers");
    const q = query(trainersRef, where("userId", "==", userId));
    const trainerSnap = await getDocs(q);

    if (trainerSnap.empty) return [];

    const gymsData = [];

    for (let trainerDoc of trainerSnap.docs) {
      const trainerData = trainerDoc.data();
      const trainerId = trainerDoc.id;
      const gymId = trainerData.gymId;

      // 2. Gym bilgisini çek
      const gymRef = doc(firestore, "gyms", gymId);
      const gymSnap = await getDoc(gymRef);

      let gymName = "Bilinmeyen Salon";
      if (gymSnap.exists()) {
        gymName = gymSnap.data().name;
      }

      // 3. Bu trainer'a bağlı students kayıtlarını çek
      const studentsRef = collection(firestore, "students");
      const sQ = query(studentsRef, where("trainerId", "==", trainerId));
      const studentsSnap = await getDocs(sQ);

      const studentsData = [];

      for (let studentDoc of studentsSnap.docs) {
        const studentData = studentDoc.data();
        const studentUserId = studentData.userId;

        // 4. Student'ın user bilgilerini çek
        const userRef = doc(firestore, "users", studentUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          studentsData.push({
            id: studentDoc.id,
            ...studentData,
            user: {
              id: userSnap.id,
              ...userSnap.data(),
            },
          });
        }
      }

      gymsData.push({
        gymId,
        gymName,
        students: studentsData,
      });
    }

    return gymsData;
  } catch (error) {
    console.error("Hata (getTrainerGymsWithStudents):", error);
    throw error;
  }
};