import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../redux/userSlice";
import { fetchAllGyms } from "../redux/gymSlice";
import Navbar from "../components/Navbar";
import UsersTable from "../components/UsersTable";
import TrainerTable from "../components/TrainerTable";
import GymsTable from "../components/GymsTable";

const Admin = () => {
  const dispatch = useDispatch();
  const { users, loadingUser, errorUser } = useSelector((state) => state.user);
  const { gyms, loading, error } = useSelector((state) => state.gym);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllGyms());
  }, [dispatch]);

  if (loadingUser || loading) return <div className="p-4">Loading...</div>;
  if (errorUser || error) return <div className="p-4 text-red-500">{errorUser || error}</div>;

  const trainers = users.filter((u) => u.role === "trainer");

  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      {/* Navbar */}
      <Navbar />

      {/* Contents */}
      <div className="mt-10 gap-10">
        <UsersTable users={users} />
        <TrainerTable trainers={trainers} />
        <GymsTable gyms={gyms} />
      </div>
    </div>
  );
};

export default Admin;