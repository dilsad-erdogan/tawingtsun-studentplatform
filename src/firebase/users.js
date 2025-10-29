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
    console.error("getAllUsers error:", error);
    toast.error("Kullanıcıları çekerken hata oluştu.");
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
      toast.success("Kullanıcı başarıyla güncellendi.");
      return true;
    } else {
      toast.error("User not found");
      return false;
    }
  } catch (error) {
    console.error("updateUserByUID error:", error);
    toast.error("Kullanıcı güncellenirken hata oluştu");
    return false;
  }
};

export const addPaymentToUser = async (userId, salary) => {
  try {
    const userRef = doc(firestore, "users", userId);

    const newPayment = {
      entryDate: new Date().toISOString().slice(0, 16).replace("T", " "),
      salary: Number(salary),
      paymentStatus: false, // default
    };

    await updateDoc(userRef, {
      payments: arrayUnion(newPayment),
    });

    toast.success("Ücret başarıyla eklendi.");
    return true;
  } catch (error) {
    console.error("addPaymentToUser error:", error);
    toast.error("Payment eklenirken hata oluştu.");
    return false;
  }
};

export const updatePaymentStatus = async (userId, entryDate) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      toast.error("Kullanıcı bulunamadı");
      return null;
    }

    const userData = userSnap.data();
    let updatedPayment = null;

    const updatedPayments = (userData.payments || []).map((payment) => {
      if (payment.entryDate === entryDate) {
        updatedPayment = { ...payment, paymentStatus: true };
        return updatedPayment;
      }
      return payment;
    });

    await updateDoc(userRef, { payments: updatedPayments });

    toast.success("Ödeme başarıyla güncellendi ✅");

    // salary'yi number'a çevirerek döndür
    if (updatedPayment) {
      return { ...updatedPayment, salary: Number(updatedPayment.salary) };
    }

    return null;
  } catch (error) {
    console.error("updatePaymentStatus hata:", error);
    toast.error("Ödeme güncellenirken hata oluştu");
    return null;
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
    toast.success(`Yeni kullanıcı eklendi.`);

    return { id: docRef.id, ...newUser };
  } catch (error) {
    console.error("addUser error:", error);
    toast.error("Kullanıcı eklenirken hata oluştu.");
    return null;
  }
};

export const updateUserRole = async (id, newRole = "trainer") => {
  try {
    const userRef = doc(firestore, "users", id);
    await updateDoc(userRef, { role: newRole });
    toast.success("Kullanıcı rolü güncellendi.");
    return true;
  } catch (error) {
    console.error("updateUserRole error:", error);
    toast.error("Kullanıcının rolü güncellenirken hata oluştu.");
    return false;
  }
};
