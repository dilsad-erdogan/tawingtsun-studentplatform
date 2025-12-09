import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { getAllStudent } from "../../../firebase/students";
import { getGymById } from "../../../firebase/gyms";

const GymReportModal = ({ isOpen, onClose, gymId }) => {
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [gymInfo, setGymInfo] = useState(null);

    useEffect(() => {
        if (isOpen && gymId) {
            // Reset state
            setProgress(0);
            setGenerating(false);
            fetchGymInfo();
        }
    }, [isOpen, gymId]);

    const fetchGymInfo = async () => {
        try {
            const data = await getGymById(gymId);
            setGymInfo(data);
        } catch (error) {
            console.error("Gym fetch error:", error);
        }
    };

    const turkishToEnglish = (str) => {
        if (!str) return "";
        return str
            .replace(/ğ/g, "g")
            .replace(/Ğ/g, "G")
            .replace(/ü/g, "u")
            .replace(/Ü/g, "U")
            .replace(/ş/g, "s")
            .replace(/Ş/g, "S")
            .replace(/ı/g, "i")
            .replace(/İ/g, "I")
            .replace(/ö/g, "o")
            .replace(/Ö/g, "O")
            .replace(/ç/g, "c")
            .replace(/Ç/g, "C");
    };

    const calculateEarnings = (students) => {
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        let totalEarnings = 0;

        students.forEach((student) => {
            if (student.payments) {
                student.payments.forEach((payment) => {
                    if (payment.status === "paid" && payment.date) {
                        const paymentDate = new Date(payment.date);
                        if (paymentDate >= oneYearAgo && paymentDate <= today) {
                            totalEarnings += Number(payment.amount) || 0;
                        }
                    }
                });
            }
        });

        return totalEarnings;
    };

    // Helper to calculate stats
    const calculateDetailedStats = (students) => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let newRegistrations = 0;
        let expiredRegistrations = 0;

        // Initialize monthly earnings map for last 12 months
        const monthlyEarnings = new Map();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            // Pre-transliterate month names here as well
            const monthName = d.toLocaleDateString('tr-TR', { month: 'short' });
            monthlyEarnings.set(key, {
                amount: 0,
                label: turkishToEnglish(monthName)
            });
        }

        students.forEach((student) => {
            // New Registrations This Month
            if (student.date) {
                const regDate = new Date(student.date);
                if (regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear) {
                    newRegistrations++;
                }
            }

            // Expired This Month logic
            if (student.date && student.studyPeriod) {
                const regDate = new Date(student.date);
                const period = parseInt(student.studyPeriod);
                if (!isNaN(period)) {
                    const expDate = new Date(regDate);
                    expDate.setMonth(expDate.getMonth() + period);
                    if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
                        expiredRegistrations++;
                    }
                }
            }

            // Monthly Earnings
            if (student.payments) {
                student.payments.forEach((payment) => {
                    if (payment.status === "paid" && payment.date) {
                        const pDate = new Date(payment.date);
                        const key = `${pDate.getFullYear()}-${pDate.getMonth()}`;
                        if (monthlyEarnings.has(key)) {
                            monthlyEarnings.get(key).amount += Number(payment.amount) || 0;
                        }
                    }
                });
            }
        });

        return {
            newRegistrations,
            expiredRegistrations,
            monthlyEarnings: Array.from(monthlyEarnings.values()) // Convert to array for chart
        };
    };

    const handleGenerateReport = async () => {
        if (!gymId || !gymInfo) return;

        setGenerating(true);
        setProgress(10); // Start

        try {
            // 1. Fetch all students
            const allStudents = await getAllStudent();
            setProgress(30);

            // Filter for this gym
            const gymStudents = allStudents.filter(s => s.gymId === gymId);

            // Stats
            const activeCount = gymStudents.filter(s => s.isActive).length;
            const totalCount = gymStudents.length;
            const { newRegistrations, expiredRegistrations, monthlyEarnings } = calculateDetailedStats(gymStudents);
            const totalEarnings = calculateEarnings(gymStudents);

            setProgress(60);

            // 2. Generate PDF
            const doc = new jsPDF();

            // Fetch custom font
            const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf';
            const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
            const filename = 'Roboto-Regular.ttf';
            const base64String = btoa(new Uint8Array(fontBytes).reduce((data, byte) => data + String.fromCharCode(byte), ''));

            doc.addFileToVFS(filename, base64String);
            doc.addFont(filename, 'Roboto', 'normal');
            doc.setFont('Roboto');

            doc.setFontSize(22);
            doc.text(turkishToEnglish(`${gymInfo.name} Raporu`), 105, 20, null, null, "center");

            doc.setFontSize(12);
            const address = turkishToEnglish(gymInfo.address || "Adres Bilgisi Yok");
            doc.text(address, 105, 28, null, null, "center");

            const dateStr = turkishToEnglish(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`);
            doc.text(dateStr, 105, 35, null, null, "center");

            doc.line(20, 40, 190, 40); // Horizontal line

            doc.setFontSize(14);
            const startY = 55;
            const lineHeight = 10;

            doc.text(turkishToEnglish(`Toplam Ogrenci Sayisi: ${totalCount}`), 20, startY);
            doc.text(turkishToEnglish(`Aktif Ogrenci Sayisi: ${activeCount}`), 20, startY + lineHeight);
            doc.text(turkishToEnglish(`Bu Ay Kayit Olanlar: ${newRegistrations}`), 20, startY + lineHeight * 2);
            doc.text(turkishToEnglish(`Bu Ay Kaydi Bitenler: ${expiredRegistrations}`), 20, startY + lineHeight * 3);
            doc.text(turkishToEnglish(`Son 12 Ay Kazanc: ${totalEarnings.toLocaleString("tr-TR")} TL`), 20, startY + lineHeight * 4);

            // Chart Section
            doc.setFontSize(14);
            doc.text(turkishToEnglish("Aylik Kazanc Grafigi (Son 12 Ay)"), 105, 120, null, null, "center");

            // Draw Chart Manually
            const chartX = 25;
            const chartY = 140;
            const chartWidth = 160;
            const chartHeight = 80;
            const maxVal = Math.max(...monthlyEarnings.map(m => m.amount), 100);
            const barWidth = (chartWidth / monthlyEarnings.length) - 4;

            // Draw Y Axis Line
            doc.line(chartX, chartY, chartX, chartY + chartHeight);
            // Draw X Axis Line
            doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight);

            monthlyEarnings.forEach((item, index) => {
                const barHeight = (item.amount / maxVal) * chartHeight;
                const x = chartX + 5 + (index * (barWidth + 4));
                const y = chartY + chartHeight - barHeight;

                // Bar
                doc.setFillColor(220, 38, 38); // Red color
                doc.rect(x, y, barWidth, barHeight, 'F');

                // Label (Month) - already transliterated
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);
                doc.text(item.label, x + (barWidth / 2), chartY + chartHeight + 5, null, null, "center");

                // Value (Amount)
                if (item.amount > 0) {
                    doc.setFontSize(7);
                    doc.text(`${item.amount}`, x + (barWidth / 2), y - 2, null, null, "center");
                }
            });

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            const footerText = turkishToEnglish("Bu rapor TawingTsun Ogrenci Takip Platformu uzerinden olusturulmustur.");
            doc.text(footerText, 105, 280, null, null, "center");

            doc.save(`${turkishToEnglish(gymInfo.name).replace(/\s+/g, "_")}_Rapor.pdf`);

            setProgress(100);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Report Generation Error:", error);
            setProgress(0);
        } finally {
            setGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={generating}
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-6 text-center">Salon Raporu</h2>

                {!gymInfo ? (
                    <div className="text-center py-4">Bilgiler yükleniyor...</div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-600 text-center mb-4">
                                <strong>{gymInfo.name}</strong> için rapor oluşturulacak.
                            </p>

                            {generating && (
                                <div className="mb-2">
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="bg-red-600 h-4 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        {progress < 100 ? "Rapor hazırlanıyor..." : "Tamamlandı!"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!generating && (
                            <button
                                onClick={handleGenerateReport}
                                className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md hover:shadow-lg"
                            >
                                Rapor Oluştur ve İndir
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default GymReportModal;
