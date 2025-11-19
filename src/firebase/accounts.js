import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

export const getUserByUID = async (authId) => {
  const accountsRef = collection(firestore, "accounts");
  const snapshot = await getDocs(accountsRef);

  let found = null;
  snapshot.forEach((doc) => {
    if (doc.data().authId === authId) {
      found = { id: doc.id, ...doc.data() };
    }
  });

  return found;
};