import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../redux/userSlice";
import Navbar from "../components/Navbar";

const Admin = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);
  const [openUserId, setOpenUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const toggleUser = (uid) => {
    setOpenUserId(openUserId === uid ? null : uid);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Contents */}
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
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
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong>Payments:</strong> {user.payments}
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