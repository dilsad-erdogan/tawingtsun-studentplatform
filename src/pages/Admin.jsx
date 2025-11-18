import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import AdminPanel from "../components/admin/AdminPanel";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      <Toaster position='top-right' />
      
      <Navbar />
      <div className="m-2">
        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;