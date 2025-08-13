import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

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