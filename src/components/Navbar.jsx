import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { logout } from "../firebase/login";
import { clearUser } from "../redux/userSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.data);

    const gym = useSelector((state) => state.gym.gym);

    const handleLogout = async () => {
        dispatch(clearUser());
        await logout();
        sessionStorage.clear();
        navigate('/login');
    };

    const handleTitleClick = () => {
        if (user) {
            if (user.isAdmin) {
                navigate('/admin');
            } else if (gym) {
                const gymName = gym.name.toLowerCase().replace(/\s+/g, "-");
                navigate(`/${gym.id}/${gymName}`);
            }
        }
    };

    let navbarTitle = "Admin";
    if (user) {
        if (user.isAdmin) {
            navbarTitle = "Admin";
        } else {
            navbarTitle = gym?.name || user.gymId || "Gym";
        }
    }

    return (
        <div className="bg-red-600 text-white px-4 sm:px-6 py-4 mt-10 flex flex-col sm:flex-row justify-between items-center relative gap-4 sm:gap-0">
            {/* Left side */}
            <div
                className="flex flex-col sm:flex-row items-center relative w-full sm:w-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleTitleClick}
            >
                <div className="relative sm:absolute sm:-left-2 mb-2 sm:mb-0">
                    <img src={logo} alt="Logo" className="w-24 h-24 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-white object-cover shadow-lg" />
                </div>

                <span className="text-center sm:text-left sm:ml-28 md:ml-36 text-xl sm:text-lg font-semibold">
                    {navbarTitle}
                </span>
            </div>

            {/* Right side */}
            <div className="text-sm sm:text-base w-full sm:w-auto flex justify-center sm:justify-end">
                <button onClick={handleLogout} className="flex items-center gap-2 hover:opacity-80 transition text-sm sm:text-base bg-red-700 sm:bg-transparent px-4 py-2 rounded-lg sm:p-0">
                    <LogOut size={20} />
                    <span>Çıkış Yap</span>
                </button>
            </div>
        </div>
    );
};

export default Navbar;