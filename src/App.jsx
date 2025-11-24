import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Trainer from "./pages/Trainer";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import GymDetail from "./pages/GymDetail";

function RedirectHandler() {
  const { data: user, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (window.location.pathname === "/login") {
        if (user.isAdmin) navigate(`/admin/${user.authId}`);
        else navigate(`/trainer/${user.authId}`);
      }
    }
  }, [user, loading, navigate]);

  return null;
}

function App() {
  const { data: user, loading } = useSelector((state) => state.user);

  if (loading || user === undefined) {
    return <div className="flex h-screen items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <Router>
      <RedirectHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/trainer/:authId"
          element={
            <ProtectedRoute isAdminAllowed={false}>
              <Trainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:authId"
          element={
            <ProtectedRoute isAdminAllowed={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.isAdmin
              ? <Navigate to={`/admin/${user.authId}`} replace />
              : <Navigate to={`/trainer/${user.authId}`} replace />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;