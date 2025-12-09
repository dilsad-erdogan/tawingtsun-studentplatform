import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllGyms } from "../../../firebase/gyms";
import { getAllStudent } from "../../../firebase/students";

const ReportModal = ({ isOpen, onClose }) => {
    const [gyms, setGyms] = useState([]);
    const [selectedGyms, setSelectedGyms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchGyms();
        } else {
            // Reset state when closed
            setSelectedGyms([]);
            setGenerating(false);
            setProgress(0);
        }
    }, [isOpen]);

    const fetchGyms = async () => {
        setLoading(true);
        const data = await getAllGyms();
        setGyms(data);
        setLoading(false);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedGyms(gyms.map((g) => g.id));
        } else {
            setSelectedGyms([]);
        }
    };

    const handleSelectGym = (gymId) => {
        if (selectedGyms.includes(gymId)) {
            setSelectedGyms(selectedGyms.filter((id) => id !== gymId));
        } else {
            setSelectedGyms([...selectedGyms, gymId]);
        }
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

    const handleGenerateReport = async () => {
        if (selectedGyms.length === 0) return;

        setGenerating(true);
        setProgress(10); // Start

        try {
            // 1. Fetch all students
            const allStudents = await getAllStudent();
            setProgress(40); // Students fetched

            // 2. Process data for selected gyms
            const reportData = [];
            const selectedGymObjects = gyms.filter((g) => selectedGyms.includes(g.id));

            let processedCount = 0;
            const totalToProcess = selectedGymObjects.length;

            for (const gym of selectedGymObjects) {
                // Filter students for this gym
                const gymStudents = allStudents.filter((s) => s.gymId === gym.id);
                const activeCount = gymStudents.filter((s) => s.isActive).length;
                const totalCount = gymStudents.length;
                const earnings = calculateEarnings(gymStudents);

                reportData.push({
                    name: gym.name,
                    totalStudents: totalCount,
                    activeStudents: activeCount,
                    earnings: earnings,
                });

                processedCount++;
                // Update progress between 40 and 90
                setProgress(40 + Math.floor((processedCount / totalToProcess) * 50));
            }

            setProgress(90); // Processing done

            // 3. Generate PDF
            const doc = new jsPDF();

            // Fetch custom font that supports Turkish characters (Roboto-Regular)
            const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf';
            const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());

            // Convert ArrayBuffer to Base64
            const filename = 'Roboto-Regular.ttf';
            const base64String = btoa(new Uint8Array(fontBytes).reduce((data, byte) => data + String.fromCharCode(byte), ''));

            // Add font to VFS and register it
            doc.addFileToVFS(filename, base64String);
            doc.addFont(filename, 'Roboto', 'normal');
            doc.setFont('Roboto');

            doc.setFontSize(18);
            doc.text("TawingTsun Yönetim Raporu", 14, 20);

            doc.setFontSize(11);
            doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`, 14, 30);

            const tableColumn = ["Salon Adi", "Toplam Ogrenci", "Aktif Ogrenci", "Son 12 Ay Kazanc"];
            const tableRows = [];

            reportData.forEach((row) => {
                const gymData = [
                    row.name,
                    row.totalStudents,
                    row.activeStudents,
                    `${row.earnings.toLocaleString("tr-TR")} TL`,
                ];
                tableRows.push(gymData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                styles: { font: "Roboto", fontSize: 10 }, // Use the custom font
                headStyles: { fillColor: [220, 38, 38] }, // Red header
            });

            // Add some footer or extra info if needed
            doc.setFontSize(10);
            doc.text("Bu rapor TawingTsun Öğrenci Takip Platformu üzerinden oluşturulmuştur.", 105, 280, null, null, "center");

            doc.save(`TA_WingTsun_Salonlar_${new Date().toISOString().slice(0, 10)}.pdf`);

            setProgress(100);
            setTimeout(() => {
                onClose();
            }, 1000); // Close after 1s
        } catch (error) {
            console.error("Report Generation Error:", error);
            setProgress(0);
        } finally {
            setGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={generating}
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Rapor Oluştur</h2>

                {loading ? (
                    <div className="text-center py-4">Salonlar yükleniyor...</div>
                ) : (
                    <>
                        <div className="mb-4 max-h-60 overflow-y-auto border rounded p-2">
                            <div className="flex items-center mb-2 pb-2 border-b">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedGyms.length === gyms.length && gyms.length > 0}
                                    disabled={generating}
                                    className="mr-2"
                                />
                                <span className="font-semibold">Tümünü Seç</span>
                            </div>
                            {gyms.map((gym) => (
                                <div key={gym.id} className="flex items-center mb-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedGyms.includes(gym.id)}
                                        onChange={() => handleSelectGym(gym.id)}
                                        disabled={generating}
                                        className="mr-2"
                                    />
                                    <span>{gym.name}</span>
                                </div>
                            ))}
                        </div>

                        {generating ? (
                            <div className="mb-4">
                                <div className="text-sm font-semibold mb-1 text-center">
                                    {progress < 100 ? "Raporlanıyor..." : "Tamamlandı!"}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-red-600 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleGenerateReport}
                                disabled={selectedGyms.length === 0}
                                className={`w-full py-2 rounded text-white font-semibold transition ${selectedGyms.length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                Raporla
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
