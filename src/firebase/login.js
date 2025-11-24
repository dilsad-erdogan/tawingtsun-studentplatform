import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, secondaryAuth } from "./firebase.js";
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

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    toast.success("Hesap başarıyla oluşturuldu");
    return userCredential.user;
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      toast.error("Bu email zaten kayıtlı");
    } else if (err.code === "auth/weak-password") {
      toast.error("Şifre çok zayıf (en az 6 karakter olmalı)");
    } else {
      toast.error("Kayıt oluşturulurken bir hata oluştu");
    }
    return null;
  }
}; //kullandım

export const logout = async () => {
  await signOut(auth);
  return true;
}; //kullandım