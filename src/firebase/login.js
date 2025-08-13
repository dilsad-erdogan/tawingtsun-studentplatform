import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "./firebase.js";
import toast from 'react-hot-toast';

export const login = async (email, password) => {
  try{
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

export const logout = async () => {
  await signOut(auth);
  return true;
};