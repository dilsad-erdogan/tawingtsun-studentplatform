import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../redux/userSlice";
import { fetchAllGyms } from "../redux/gymSlice";
import { fetchAllTrainers } from "../redux/trainerSlice";
import Navbar from "../components/Navbar";
import UsersTable from "../components/tables/UsersTable";
import TrainerTable from "../components/tables/TrainerTable";
import GymsTable from "../components/tables/GymsTable";

const Admin = () => {
  const dispatch = useDispatch();
  const { users, loadingUser, errorUser } = useSelector((state) => state.user);
  const { gyms, loading, error } = useSelector((state) => state.gym);
  const { trainers, loadingTrainer, errorTrainer } = useSelector((state) => state.trainer);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllGyms());
    dispatch(fetchAllTrainers());
  }, [dispatch]);

  if (loadingUser || loading || loadingTrainer) return <div className="p-4">Loading...</div>;
  if (errorUser || error || errorTrainer) return <div className="p-4 text-red-500">{errorUser || error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      {/* Navbar */}
      <Navbar />

      {/* Contents */}
      <div className="mt-10 gap-10">
        <UsersTable users={users} />
        <TrainerTable trainers={trainers} users={users} gyms={gyms} />
        <GymsTable gyms={gyms} users={users} />
      </div>
    </div>
  );
};

export default Admin;