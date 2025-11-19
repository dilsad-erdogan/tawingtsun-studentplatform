import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, isAdminAllowed }) {
  const user = useSelector((state) => state.user.data);

  // 1) Login olmayan kullanıcı → login’e
  if (!user) return <Navigate to="/login" replace />;

  // 2) Admin değil ama admin sayfasına erişmeye çalışıyor
  if (isAdminAllowed && !user.isAdmin) {
    return <Navigate to={`/trainer/${user.authId}`} replace />;
  }

  // 3) Admin olan biri eğitmen sayfasına erişmeye çalışıyorsa
  if (!isAdminAllowed && user.isAdmin) {
    return <Navigate to={`/admin/${user.authId}`} replace />;
  }

  return children;
}