import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Trainer from "./pages/Trainer";
import Admin from "./pages/Admin";
import Student from "./pages/Student";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const user = useSelector((state) => state.user.data);

  return (
    <div className="h-screen text-black">
      <Router>
        <Routes>
          {/* Giriş sayfası */}
          <Route path="/login" element={<Login />} />

          {/* Korumalı sayfalar */}
          <Route
            path="/trainer/:uid"
            element={
              <ProtectedRoute role="trainer">
                <Trainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/:uid"
            element={
              <ProtectedRoute role="student">
                <Student />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/:uid"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Root yönlendirme */}
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <Navigate to={`/${user.role}/${user.uid}`} replace />
              )
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;