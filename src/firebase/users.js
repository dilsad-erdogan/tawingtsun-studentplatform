import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, addDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import toast from "react-hot-toast";

export const getUserByUID = async (uid) => {
  const usersRef = collection(firestore, "users");
  const snapshot = await getDocs(usersRef);
  let foundUser = null;

  snapshot.forEach((docSnap) => {
    if (docSnap.data().uid === uid) {
      foundUser = { id: docSnap.id, ...docSnap.data() };
    }
  });

  return foundUser;
};

export const getAllUsers = async () => {
  try {
    const usersRef = collection(firestore, "users");
    const querySnapshot = await getDocs(usersRef);

    const users = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data()
    }));

    return users;
  } catch (error) {
    toast.error("Error while withdrawing users:", error);
    return [];
  }
};

export const updateUserByUID = async (uid, updatedData) => {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0].ref;
      await updateDoc(userDoc, updatedData);
      toast.success("User updated successfully!");
      return true;
    } else {
      toast.error("User not found");
      return false;
    }
  } catch (error) {
    toast.error("Error updating user:", error);
    return false;
  }
};

export const addPaymentToUser = async (userId, salary) => {
  try {
    const userRef = doc(firestore, "users", userId);

    const newPayment = {
      entryDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      salary: Number(salary),
      paymentStatus: false, // default
    };

    await updateDoc(userRef, {
      payments: arrayUnion(newPayment),
    });

    toast.success("Payment başarıyla eklendi:", newPayment);
    return true;
  } catch (error) {
    toast.error("Payment eklenirken hata:", error);
    return false;
  }
};

export const updatePaymentStatus = async (userId, entryDate) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      toast.error("Kullanıcı bulunamadı");
      return false;
    }

    const userData = userSnap.data();
    const updatedPayments = (userData.payments || []).map((payment) => {
      if (payment.entryDate === entryDate) {
        return { ...payment, paymentStatus: true };
      }
      return payment;
    });

    await updateDoc(userRef, { payments: updatedPayments });

    toast.success("Ödeme başarıyla güncellendi ✅");
    return true;
  } catch (error) {
    console.error("updatePaymentStatus hata:", error);
    toast.error("Ödeme güncellenirken hata oluştu");
    return false;
  }
};

const generatePassword = (fullName, phone) => {
  const nameParts = fullName.trim().split(" ");

  let nameCode = "";
  nameParts.forEach(part => {
    nameCode += part.slice(0, 2).toLowerCase();
  });
  const phoneCode = phone.slice(-4);

  return `${nameCode}${phoneCode}`;
};

export const addUser = async (userData) => {
  try {
    const usersRef = collection(firestore, "users");

    const password = generatePassword(userData.name, userData.phone);

    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const uid = userCredential.user.uid;

    const newUser = {
      uid,
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      role: "student",
      gender: userData.gender || "",
      weight: userData.weight || 0,
      height: userData.height || 0,
      age: userData.age || 0,
      payments: [],
      isActive: true
    };

    const docRef = await addDoc(usersRef, newUser);
    toast.success(`Yeni kullanıcı eklendi: ${docRef.id}`);

    return { id: docRef.id, ...newUser };
  } catch (error) {
    toast.error("Kullanıcı eklenirken hata:", error);
    return null;
  }
};

export const updateUserRole = async (id, newRole = "trainer") => {
  try {
    const userRef = doc(firestore, "users", id);
    await updateDoc(userRef, { role: newRole });
    toast.success(`User role updated to ${newRole}`);
    return true;
  } catch (error) {
    toast.error("Error updating user role:", error);
    return false;
  }
};
