import Navbar from "../components/Navbar";
import UsersTable from "../components/tables/UsersTable";
import TrainerTable from "../components/tables/TrainerTable";
import GymsTable from "../components/tables/GymsTable";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      {/* Navbar */}
      <Navbar />

      {/* Contents */}
      <div className="mt-10 gap-10">
        <UsersTable />
        <TrainerTable />
        <GymsTable />
      </div>
    </div>
  );
};

export default Admin;