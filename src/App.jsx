import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import Trainer from "./pages/Trainer";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { fetchUserByUID, clearUser } from "./redux/userSlice";
import GymDetail from "./pages/GymDetail";

function App() {
  const user = useSelector((state) => state.user.data);   // undefined | null | data
  const dispatch = useDispatch();

  // Firebase kullanıcı kontrolü
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(fetchUserByUID(currentUser.uid));  // accounts tablosundan çek
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsub();
  }, [dispatch]);

  // Kullanıcı verisi henüz gelmediyse
  if (user === undefined) {
    return <div className="flex h-screen items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div className="h-screen text-black">
      <Router>
        <Routes>
          {/* --- Login Page --- */}
          <Route path="/login" element={<Login />} />

          {/* --- Trainer Page --- */}
          <Route
            path="/trainer/:authId"
            element={
              <ProtectedRoute isAdminAllowed={false}>
                <Trainer />
              </ProtectedRoute>
            }
          />

          {/* --- Admin Page --- */}
          <Route
            path="/admin/:authId"
            element={
              <ProtectedRoute isAdminAllowed={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* --- Root Page (/) --- */}
          <Route
            path="/"
            element={
              user === null ? (
                <Navigate to="/login" replace />
              ) : user.isAdmin ? (
                <Navigate to={`/admin/${user.authId}`} replace />
              ) : (
                <Navigate to={`/trainer/${user.authId}`} replace />
              )
            }
          />

          <Route
              path="/admin/:authId/gym/:gymId"
              element={
                  <ProtectedRoute isAdminAllowed={true}>
                      <GymDetail />
                  </ProtectedRoute>
              }
          />

          {/* --- Unknown route: redirect to root --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;