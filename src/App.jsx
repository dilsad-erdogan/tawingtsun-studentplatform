import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Trainer from './pages/Trainer';
import Admin from './pages/Admin';
import Student from './pages/Student';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { logout } from './redux/userSlice';

function App() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
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
    return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="h-screen text-black">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : user.role === 'trainer' ? (
                <Navigate to={`/trainer/${user.uid}`} replace />
              ) : user.role === 'admin' ? (
                <Navigate to={`/admin/${user.uid}`} replace />
              ) : user.role === 'student' ? (
                <Navigate to={`/student/${user.uid}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/trainer/:uid" element={<Trainer />} />
          <Route path="/student/:uid" element={<Student />} />
          <Route path="/admin/:uid" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;