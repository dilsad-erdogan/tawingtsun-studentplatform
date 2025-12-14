import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { fetchGymById } from "./redux/gymSlice";
import { fetchUserByUID } from "./redux/userSlice";

import Login from "./pages/login";
import Trainer from "./pages/Trainer";
import Admin from "./pages/Admin";
import GymDetail from "./pages/GymDetail";
import StudentDetail from "./pages/StudentDetail";

import ProtectedRoute from "./components/ProtectedRoute";

function RedirectHandler() {
  const { data: user, loading } = useSelector((state) => state.user);
  const { gym } = useSelector((state) => state.gym);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !user.isAdmin) {
      // admin değilse → kullanıcının gym bilgisi yoksa çek
      if (!gym && user.gymId) dispatch(fetchGymById(user.gymId));
    }
  }, [user, loading, gym, dispatch]);

  useEffect(() => {
    if (!loading && user) {
      // login sayfasındaysan yönlendir
      if (window.location.pathname === "/login") {
        if (user.isAdmin) {
          navigate("/admin");
        } else if (gym) {
          const gymName = gym.name.toLowerCase().replace(/\s+/g, "-");
          navigate(`/${gym.id}/${gymName}`);
        }
      }
    }
  }, [user, loading, navigate, gym]);

  return null;
}

function App() {
  const { data: user, loading } = useSelector((state) => state.user);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Auth var, ama Redux'ta user yoksa çekmeyi dene (opsiyonel ama sağlam olur)
        if (!user) {
          await dispatch(fetchUserByUID(currentUser.uid));
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  if (!isAuthReady || loading || user === undefined) {
    return <div className="flex h-screen items-center justify-center text-xl">Yükleniyor...</div>;
  }

  return (
    <Router>
      <RedirectHandler />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute isAdminAllowed={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:gymId/:gymName"
          element={
            <ProtectedRoute isAdminAllowed={false}>
              <Trainer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.isAdmin
                ? <Navigate to="/admin" replace />
                : <Navigate to="/login" replace /> // redirect handler yönlendirecek
          }
        />

        <Route
          path="/admin/:gymId/:gymName"
          element={
            <ProtectedRoute isAdminAllowed={true}>
              <GymDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/student/:id"
          element={
            <ProtectedRoute isAdminAllowed={true}>
              <StudentDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/:id"
          element={
            <ProtectedRoute isAdminAllowed={false}>
              <StudentDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;