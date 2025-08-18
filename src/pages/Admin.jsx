import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, clearUser } from "../redux/userSlice";
import { LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/login";

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const { users, loading, error } = useSelector((state) => state.user);
  const [openUserId, setOpenUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const toggleUser = (uid) => {
    setOpenUserId(openUserId === uid ? null : uid);
  };

  const handleLogout =  async() => {
    dispatch(clearUser());
    await logout();
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-red-600 text-white px-4 sm:px-6 py-3 mt-10 flex justify-between items-center relative">
        {/* Left side */}
        <div className="flex items-center relative">
          {/* Logo */}
          <div className="absolute -left-2">
            <img src={logo} alt="Logo" className="w-36 h-36 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-white object-cover shadow-lg" />
          </div>
          {/* Navbar text */}
          <span className="ml-24 sm:ml-28 md:ml-36 text-base sm:text-lg font-semibold">
            {user?.name || "Admin"}
          </span>
        </div>

        {/* Right side */}
        <button onClick={handleLogout} className="flex items-center gap-2 hover:opacity-80 transition text-sm sm:text-base">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Contents */}
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">User List</h1>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.uid} className="border rounded-lg shadow-sm bg-white overflow-hidden">
              <button onClick={() => toggleUser(user.uid)} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 flex justify-between items-center">
                <span>
                  {user.name} {user.surname}
                </span>
                <span>{openUserId === user.uid ? "▲" : "▼"}</span>
              </button>

              {/* Details */}
              {openUserId === user.uid && (
                <div className="px-4 py-3 bg-gray-50 text-sm">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Adjective:</strong> {user.adjective}
                  </p>
                  <p>
                    <strong>Features:</strong> {user.features}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;