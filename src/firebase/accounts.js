import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

export const getUserByUID = async (authId) => {
  const accountsRef = collection(firestore, "accounts");

  const q = query(accountsRef, where("authId", "==", authId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};