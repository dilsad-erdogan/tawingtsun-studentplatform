import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import AdminPanel from "../components/admin/AdminPanel";
import AdminSidebar from "../components/admin/AdminSidebar";
import TrainerPanel from "../components/trainer/TrainerPanel";
import StudentPanel from "../components/student/StudentPanel";
import { useState } from "react";

const Admin = () => {
  const [activePanel, setActivePanel] = useState("admin");

  const renderPanel = () => {
    switch (activePanel) {
      case "student":
        return <StudentPanel />;
      case "trainer":
        return <TrainerPanel />;
      case "admin":
      default:
        return <AdminPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      <Toaster position='top-right' />
      
      {/* Navbar */}
      <Navbar />

      {/* Contents */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-52 border-r h-full mt-20 shadow-md">
          <AdminSidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        </div>

        {/* Panel */}
        <div className="flex-1 p-6">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default Admin;