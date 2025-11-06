import { SquareUserRound, BookUser, House } from "lucide-react";

const AdminSidebar = ({ activePanel, setActivePanel }) => {
  const menuItems = [
    { key: "student", icon: <SquareUserRound size={22} />, label: "Öğrenci" },
    { key: "trainer", icon: <BookUser size={22} />, label: "Eğitimci" },
    { key: "admin", icon: <House size={22} />, label: "Admin" },
  ];

  return (
    <div className="flex flex-col bg-red-600 text-white w-20 md:w-56 p-5 gap-10 shadow-xl rounded-r-2xl transition-all">
      {menuItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActivePanel(item.key)}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
            activePanel === item.key
              ? "bg-white text-red-600 font-semibold shadow-md"
              : "hover:bg-red-500 hover:shadow-lg"
          }`}
        >
          <span>{item.icon}</span>
          <span className="hidden md:inline text-base">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AdminSidebar;