import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/login";
import { clearUser } from "../redux/userSlice";
import { LogOut, CircleUser } from "lucide-react";
import UserModal from "./modals/userModal";
import { useState } from "react";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.data);
    const [modalOpen, setModalOpen] = useState(false);

    const handleLogout =  async() => {
        dispatch(clearUser());
        await logout();
        localStorage.clear();
        navigate('/login');
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="bg-red-600 text-white px-4 sm:px-6 py-3 mt-10 flex justify-between items-center relative">
            {/* Left side */}
            <div className="flex items-center relative">
                {/* Logo */}
                <div className="absolute -left-2">
                    <img src={logo} alt="Logo" className="w-36 h-36 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-white object-cover shadow-lg" />
                </div>
                {/* Navbar text */}
                <span className="ml-24 sm:ml-28 md:ml-36 text-base sm:text-lg font-semibold">
                    {user?.name || (localStorage.getItem('user') ? localStorage.getItem('user').replace(/"/g, "") : "Admin")}
                </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4 text-sm sm:text-base">
                <CircleUser onClick={() => openModal()} size={20} />

                <button onClick={handleLogout} className="flex items-center gap-2 hover:opacity-80 transition text-sm sm:text-base">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            <UserModal isOpen={modalOpen} onClose={closeModal} user={user} />
        </div>
    )
}

export default Navbar