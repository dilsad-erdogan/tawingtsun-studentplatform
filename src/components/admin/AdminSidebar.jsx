import { SquareUserRound, BookUser, House } from "lucide-react";

const AdminSidebar = ({ activePanel, setActivePanel }) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Öğrenci */}
      <button onClick={() => setActivePanel("student")} className={`flex items-center gap-2 hover:text-red-600 ${activePanel === "student" ? "text-red-600 text-2xl font-semibold" : "text-gray-700"}`}>
        <SquareUserRound />
        <span className="hidden md:inline">Öğrenci</span>
      </button>

      {/* Eğitimci */}
      <button onClick={() => setActivePanel("trainer")} className={`flex items-center gap-2 hover:text-red-600 ${activePanel === "trainer" ? "text-red-600 text-2xl font-semibold" : "text-gray-700"}`}>
        <BookUser />
        <span className="hidden md:inline">Eğitimci</span>
      </button>

      {/* Admin */}
      <button onClick={() => setActivePanel("admin")} className={`flex items-center gap-2 hover:text-red-600 ${activePanel === "admin" ? "text-red-600 text-2xl font-semibold" : "text-gray-700"}`}>
        <House />
        <span className="hidden md:inline">Admin</span>
      </button>
    </div>
  );
};

export default AdminSidebar;