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
      monthlySalary: [],
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

export const addOwnsToGym = async (gymId, userId) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      ownUser: arrayUnion(userId),
    });

    toast.success("Kullanıcı başarıyla eklendi.");
    return true;
  } catch (error) {
    console.error("addOwnsToGym error:", error);
    toast.error("Kullanıcı eklenirken hata.");
    return false;
  }
};

export const removeOwn = async (gymId, userId) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      ownUser: arrayRemove(userId),
    });

    toast.success("Kullanıcı başarıyla silindi");
    return true;
  } catch (error) {
    console.error("removeOwn error:", error);
    toast.error("Kullanıcı silinirken hata.");
    return false;
  }
};

export const addTrainersToGym = async (gymId, userId) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      trainers: arrayUnion(userId),
    });

    toast.success("Kullanıcı başarıyla eklendi.");
    return true;
  } catch (error) {
    console.error("addTrainersToGym error:", error);
    toast.error("Kullanıcı eklenirken hata.");
    return false;
  }
};

export const removeTrainer = async (gymId, userId) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);

    await updateDoc(gymRef, {
      trainers: arrayRemove(userId),
    });

    toast.success("Kullanıcı başarıyla silindi");
    return true;
  } catch (error) {
    console.error("removeTrainer error:", error);
    toast.error("Kullanıcı silinirken hata.");
    return false;
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
    console.error("getGymsForTrainer error:", error);
    throw error;
  }
};

export const addSalaryToGym = async (gymId, amount) => {
  try {
    const gymRef = doc(firestore, "gyms", gymId);

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) throw new Error("Geçersiz ödeme miktarı");

    // 🔹 Şu anki yıl-ay bilgisi (örn: 2025-09)
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // 🔹 Mevcut gym verisini çek
    const gymSnap = await getDoc(gymRef);
    if (!gymSnap.exists()) throw new Error("Gym bulunamadı");

    const gymData = gymSnap.data();
    let salaryArray = gymData.totalSalaryMonth || [];

    // 🔹 O ay için kayıt var mı?
    const existingMonthIndex = salaryArray.findIndex((m) => m.month === monthKey);

    if (existingMonthIndex >= 0) {
      // Varsa toplamı güncelle
      salaryArray[existingMonthIndex].total += numericAmount;
    } else {
      // Yoksa yeni kayıt aç
      salaryArray.push({
        month: monthKey,
        total: numericAmount,
      });
    }

    // 🔹 Firestore’a güncelle
    await updateDoc(gymRef, {
      totalSalaryMonth: salaryArray,
    });
  } catch (error) {
    console.error("addSalaryToGym error:", error);
    throw error;
  }
};