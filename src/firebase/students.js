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

export const getStudentTrainerAndGym = async (studentUserId) => {
  try {
    // 1. Students tablosunda userId eşleşen dokümanı bul
    const q = query(
      collection(firestore, "students"),
      where("userId", "==", studentUserId)
    );
    const studentSnap = await getDocs(q);

    if (studentSnap.empty) {
      throw new Error("Öğrenci bulunamadı");
    }

    // tek sonuç alacağını varsayıyorum (her öğrenci 1 satır)
    const studentDoc = studentSnap.docs[0];
    const studentData = studentDoc.data();
    const trainerId = studentData.trainerId;

    if (!trainerId) {
      throw new Error("Bu öğrenciye atanmış bir eğitmen yok");
    }

    // 2. Trainers tablosundan userId ve gymId'yi al
    const trainerRef = doc(firestore, "trainers", trainerId);
    const trainerSnap = await getDoc(trainerRef);

    if (!trainerSnap.exists()) {
      throw new Error("Eğitmen bulunamadı");
    }

    const trainerData = trainerSnap.data();
    const { userId: trainerUserId, gymId } = trainerData;

    // 3. Eğitmenin user bilgilerini getir (users tablosu)
    const trainerUserRef = doc(firestore, "users", trainerUserId);
    const trainerUserSnap = await getDoc(trainerUserRef);

    const trainerUserData = trainerUserSnap.exists() ? trainerUserSnap.data() : null;

    // 4. Gym bilgilerini getir
    const gymRef = doc(firestore, "gyms", gymId);
    const gymSnap = await getDoc(gymRef);

    const gymData = gymSnap.exists() ? gymSnap.data() : null;

    // 🔥 Geriye birleşik obje dön
    return {
      student: { id: studentUserId, ...studentData },
      trainer: { id: trainerId, ...trainerData, user: trainerUserData },
      gym: { id: gymId, ...gymData }
    };
  } catch (error) {
    console.error("getStudentTrainerAndGym hata:", error);
    throw error;
  }
};