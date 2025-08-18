import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import UsersTable from "../components/UsersTable";
import TrainerTable from "../components/TrainerTable";

const Admin = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const trainers = users.filter((u) => u.role === "trainer");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Contents */}
      <UsersTable users={users} />
      <TrainerTable trainers={trainers} />
    </div>
  );
};

export default Admin;