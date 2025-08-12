import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

export const getUserByUID = async (uid) => {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      console.log("Kullanıcı bulunamadı");
      return null;
    }
  } catch (error) {
    console.error("Kullanıcı çekilirken hata:", error);
    return null;
  }
};