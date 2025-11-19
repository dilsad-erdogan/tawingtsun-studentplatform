import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Trainer from "./pages/Trainer";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const user = useSelector((state) => state.user.data);

  return (
    <div className="h-screen text-black">
      <Router>
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
              !user ? (
                <Navigate to="/login" replace />
              ) : user.isAdmin ? (
                <Navigate to={`/admin/${user.authId}`} replace />
              ) : (
                <Navigate to={`/trainer/${user.authId}`} replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;