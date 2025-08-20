import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Trainer from './pages/Trainer';
import Admin from './pages/Admin';
import Student from './pages/Student';
import { useSelector } from 'react-redux';

function App() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="h-screen text-black">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route path="/login" element={
              user ? (
                user.role === 'trainer' ? (
                  <Navigate to={`/trainer/${user.uid}`} replace />
                ) : user.role === 'admin' ? (
                  <Navigate to={`/admin/${user.uid}`} replace />
                ) : user.role === 'student' ? (
                  <Navigate to={`/student/${user.uid}`} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          <Route path="/trainer/:uid" element={<Trainer />} />
          <Route path="/student/:uid" element={<Student />} />
          <Route path="/admin/:uid" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;