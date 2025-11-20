import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "./firebase.js";
import toast from 'react-hot-toast';

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      toast.error("Kullanıcı bulunamadı");
    } else if (err.code === "auth/wrong-password") {
      toast.error("Şifre hatalı");
    } else if (err.code === "auth/too-many-requests") {
      toast.error("Çok fazla deneme. Lütfen biraz bekleyin.");
    } else {
      toast.error("Bir hata oluştu");
    }
    return null;
  }
}; //kullandım

export const logout = async () => {
  await signOut(auth);
  return true;
}; //kullandım