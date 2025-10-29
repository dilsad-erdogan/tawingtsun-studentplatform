import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { logout } from "../redux/userSlice";

export default function ProtectedRoute({ children, role }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(logout());
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!authChecked) {
    return <div className="flex items-center justify-center h-screen">Oturum kontrol ediliyor...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}/${user.uid}`} replace />;
  }

  return children;
}