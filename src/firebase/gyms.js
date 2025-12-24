import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where, deleteDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import { deleteUser } from "firebase/auth";
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
    toast.error("Salon bilgisi çekilirken hata oluştu.");
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

export const deleteGymAndAccount = async (gymId) => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Oturum açmanız gerekiyor!");
    return false;
  }

  try {
    // 1. Find the Account linked to this gym
    const accountsRef = collection(firestore, "accounts");
    const q = query(accountsRef, where("gymId", "==", gymId));
    const snapshot = await getDocs(q);

    let accountAuthId = null;
    let accountDocId = null;

    if (!snapshot.empty) {
      const accountDoc = snapshot.docs[0];
      accountAuthId = accountDoc.data().authId;
      accountDocId = accountDoc.id;
    }

    // 1.5 Delete All Students associated with this gym
    const studentsRef = collection(firestore, "students");
    const studentsQuery = query(studentsRef, where("gymId", "==", gymId));
    const studentsSnapshot = await getDocs(studentsQuery);

    if (!studentsSnapshot.empty) {
      const deletePromises = studentsSnapshot.docs.map(studentDoc =>
        deleteDoc(doc(firestore, "students", studentDoc.id))
      );
      await Promise.all(deletePromises);
      console.log(`${studentsSnapshot.size} students deleted for gym ${gymId}`);
    }

    // 2. Delete Gym Document
    const gymRef = doc(firestore, "gyms", gymId);
    await deleteDoc(gymRef);

    // 3. Delete Account Document (if found)
    if (accountDocId) {
      const accountRef = doc(firestore, "accounts", accountDocId);
      await deleteDoc(accountRef);
    }

    // 4. Delete Auth User (Only if it matches current user)
    // Note: Admin cannot delete other users via client SDK.
    if (accountAuthId) {
      if (user.uid === accountAuthId) {
        await deleteUser(user);
        toast.success("Hesap ve Salon başarıyla silindi (Kendi hesabınız).");
        return { success: true, deletedSelf: true };
      } else {
        console.warn("Auth user deletion skipped: Admin cannot delete another user client-side.");
        toast.success("Salon ve Hesap verisi silindi.");
        return { success: true, deletedSelf: false };
      }
    }

    toast.success("Salon başarıyla silindi!");
    return { success: true, deletedSelf: false };

  } catch (error) {
    console.error("deleteGymAndAccount error:", error);
    toast.error("Silme işlemi sırasında hata oluştu.");
    return false;
  }
};//kullandım