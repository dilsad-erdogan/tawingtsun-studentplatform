import React, { useState } from 'react';
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import TrainerSidebar from "../components/trainer/TrainerSidebar";
import TrainerPanel from "../components/trainer/TrainerPanel";
import StudentPanel from "../components/student/StudentPanel";

const Trainer = () => {
  const [activePanel, setActivePanel] = useState("trainer");

  const renderPanel = () => {
    switch (activePanel) {
      case "student":
        return <StudentPanel />;
      case "trainer":
      default:
        return <TrainerPanel />;
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
          <TrainerSidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        </div>

        {/* Panel */}
        <div className="flex-1 p-6">
          {renderPanel()}
        </div>
      </div>
    </div>
  )
}

export default Trainer