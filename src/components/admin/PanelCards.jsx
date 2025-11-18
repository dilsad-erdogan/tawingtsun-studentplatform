import { Users, UserCheck, Dumbbell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/userSlice";
import { fetchAllTrainers } from "../../redux/trainerSlice";
import { fetchAllGyms } from "../../redux/gymSlice";
import { useEffect } from "react";

const PanelCards = () => {
    const dispatch = useDispatch();

    const { users } = useSelector((state) => state.user);
    const { trainers } = useSelector((state) => state.trainer);
    const { gyms } = useSelector((state) => state.gym);

    const uniqueTrainerCount = new Set( trainers.map((t) => t.userId).filter(Boolean)).size;

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAllTrainers());
        dispatch(fetchAllGyms());
    }, [dispatch]);

    const stats = [
        { label: "Kullanıcı Sayısı", value: users?.length || 0, icon: <Users className="text-red-600 w-8 h-8" /> },
        { label: "Eğitmen Sayısı", value: uniqueTrainerCount || 0, icon: <UserCheck className="text-red-600 w-8 h-8" /> },
        { label: "Spor Salonu Sayısı", value: gyms?.length || 0, icon: <Dumbbell className="text-red-600 w-8 h-8" /> },
        { label: "Spor Salonu Sayısı", value: gyms?.length || 0, icon: <Dumbbell className="text-red-600 w-8 h-8" /> },
        { label: "Spor Salonu Sayısı", value: gyms?.length || 0, icon: <Dumbbell className="text-red-600 w-8 h-8" /> }
    ];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                {stats.map((item, index) => (
                <div key={index} className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-all border border-gray-100">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                        <h2 className="text-3xl font-bold text-gray-800 mt-1">{item.value}</h2>
                    </div>
                    <div className="bg-red-100 rounded-full p-3">
                        {item.icon}
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default PanelCards