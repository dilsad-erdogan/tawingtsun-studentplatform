import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, addDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const getUserByUID = async (uid) => {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error while withdrawing user:", error);
    return null;
  }
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
    console.error("Error while withdrawing users:", error);
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
      console.log("User updated successfully!");
      return true;
    } else {
      console.log("User not found");
      return false;
    }
  } catch (error) {
    console.error("Error updating user:", error);
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

    console.log("Payment başarıyla eklendi:", newPayment);
    return true;
  } catch (error) {
    console.error("Payment eklenirken hata:", error);
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
    console.log("Yeni kullanıcı eklendi:", docRef.id);

    return { id: docRef.id, ...newUser };
  } catch (error) {
    console.error("Kullanıcı eklenirken hata:", error);
    return null;
  }
};

export const updateUserRole = async (id, newRole = "trainer") => {
  try {
    const userRef = doc(firestore, "users", id);
    await updateDoc(userRef, { role: newRole });
    console.log(`User role updated to ${newRole}`);
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
  }
};
