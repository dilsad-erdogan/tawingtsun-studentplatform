import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { fetchAllStudents } from "../redux/studentSlice";
import { fetchAllGyms } from "../redux/gymSlice";

import Navbar from "../components/navbar";
import AdminPanel from "../components/admin/adminPanel";

const Admin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllGyms());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      <Toaster position="top-right" />

      <Navbar />
      <div className="m-2">
        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;