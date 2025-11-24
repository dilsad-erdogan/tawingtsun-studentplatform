import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";

export const getUserByUID = async (authId) => {
  const accountsRef = collection(firestore, "accounts");

  const q = query(accountsRef, where("authId", "==", authId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}; //kullandım

export const addAccount = async ({ authId, email, gymId, isAdmin = false }) => {
  try {
    const accountRef = doc(collection(firestore, "accounts"));

    await setDoc(accountRef, {
      authId,
      email,
      gymId,
      isAdmin
    });

    return { id: accountRef.id };
  } catch (error) {
    console.error("Add Account Error:", error);
    throw error;
  }
}; //kullandım