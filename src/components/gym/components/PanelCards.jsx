import { Users, UserRoundX, UserPlus, UserMinus } from "lucide-react";
import { useSelector } from "react-redux";

const PanelCards = ({ gymId }) => {
    const { students } = useSelector((state) => state.student);

    // --- İstatistik Hesaplama ---
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const convertTimestamp = (ts) => {
        if (!ts) return null;
        if (ts instanceof Date) return ts;
        if (typeof ts === "string") return new Date(ts);
        if (ts.seconds) return new Date(ts.seconds * 1000);
        return null;
    };

    // Sadece bu salona ait öğrencileri filtrele
    const gymStudents = students.filter((s) => s.gymId === gymId);

    const activeStudents = gymStudents.filter((s) => s.isActive === true);
    const monthlyNew = activeStudents.filter((s) => {
        const registerDate = convertTimestamp(s.date);
        return registerDate && registerDate >= oneMonthAgo;
    }).length;

    const passiveStudents = gymStudents.filter((s) => s.isActive === false);
    const monthlyExpired = passiveStudents.filter((s) => {
        const registerDate = convertTimestamp(s.date);
        if (!registerDate || !s.studyPeriod) return false;

        const studyPeriodMonths = parseInt(s.studyPeriod);
        if (isNaN(studyPeriodMonths)) return false;

        // Bitiş tarihi = kayıt + studyPeriod ay
        const endDate = new Date(registerDate);
        endDate.setMonth(endDate.getMonth() + studyPeriodMonths);

        return endDate >= oneMonthAgo && endDate <= now;
    }).length;

    const stats = [
        {
            label: "Toplam aktif öğrenci",
            value: activeStudents.length,
            icon: <Users className="text-red-600 w-8 h-8" />,
        },
        {
            label: "Toplam pasif öğrenci",
            value: passiveStudents.length,
            icon: <UserRoundX className="text-red-600 w-8 h-8" />,
        },
        {
            label: "Aylık yeni kayıt",
            value: monthlyNew,
            icon: <UserPlus className="text-red-600 w-8 h-8" />,
        },
        {
            label: "Aylık kaydı bitenler",
            value: monthlyExpired,
            icon: <UserMinus className="text-red-600 w-8 h-8" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
                <div
                    key={index}
                    className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-all border border-gray-100"
                >
                    <div>
                        <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                        <h2 className="text-3xl font-bold text-gray-800 mt-1">
                            {item.value}
                        </h2>
                    </div>
                    <div className="bg-red-100 rounded-full p-3">{item.icon}</div>
                </div>
            ))}
        </div>
    )
}

export default PanelCards;