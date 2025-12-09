import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getStudentById } from "../../../firebase/students";
import { getGymById } from "../../../firebase/gyms";

const StudentReportModal = ({ isOpen, onClose, studentId }) => {
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [studentInfo, setStudentInfo] = useState(null);
    const [gymInfo, setGymInfo] = useState(null);

    useEffect(() => {
        if (isOpen && studentId) {
            setProgress(0);
            setGenerating(false);
            setStudentInfo(null);
            setGymInfo(null);
            fetchData();
        }
    }, [isOpen, studentId]);

    const fetchData = async () => {
        try {
            const sData = await getStudentById(studentId);
            setStudentInfo(sData);

            if (sData && sData.gymId) {
                const gData = await getGymById(sData.gymId);
                setGymInfo(gData);
            }
        } catch (error) {
            console.error("Data fetch error:", error);
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

    const handleGenerateReport = async () => {
        if (!studentInfo) return;

        setGenerating(true);
        setProgress(10);

        try {
            const doc = new jsPDF();
            setProgress(30);

            // Fetch custom font
            const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf';
            const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
            const filename = 'Roboto-Regular.ttf';
            const base64String = btoa(new Uint8Array(fontBytes).reduce((data, byte) => data + String.fromCharCode(byte), ''));

            doc.addFileToVFS(filename, base64String);
            doc.addFont(filename, 'Roboto', 'normal');
            doc.setFont('Roboto');

            // --- HEADER ---
            doc.setFontSize(20);
            const title = turkishToEnglish(`${studentInfo.name} - Ogrenci Raporu`);
            doc.text(title, 105, 20, null, null, "center");

            doc.setFontSize(10);
            doc.setTextColor(150);
            const dateStr = turkishToEnglish(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`);
            doc.text(dateStr, 105, 28, null, null, "center");
            doc.setTextColor(0);

            doc.line(15, 35, 195, 35); // Horizontal line

            let startY = 45;

            // --- SECTION 1: Personal & Gym Info ---
            doc.setFontSize(14);
            doc.setTextColor(200, 0, 0); // Red title
            doc.text(turkishToEnglish("Ogrenci ve Salon Bilgileri"), 15, startY);
            doc.setTextColor(0);
            doc.setFontSize(10);

            startY += 10;
            const leftColX = 15;
            const rightColX = 110;
            const lineHeight = 7;

            // Student Info Text
            const tName = turkishToEnglish(`Ad Soyad: ${studentInfo.name}`);
            const tPhone = turkishToEnglish(`Telefon: ${studentInfo.phone || '-'}`);
            const tGroup = turkishToEnglish(`Grup: ${studentInfo.group || '-'}`);
            const tLevel = turkishToEnglish(`Seviye: ${studentInfo.level || '-'}`);
            const tStatus = turkishToEnglish(`Durum: ${studentInfo.isActive ? 'Aktif' : 'Pasif'}`);

            doc.text(tName, leftColX, startY);
            doc.text(tPhone, leftColX, startY + lineHeight);
            doc.text(tGroup, leftColX, startY + lineHeight * 2);
            doc.text(tLevel, leftColX, startY + lineHeight * 3);
            doc.text(tStatus, leftColX, startY + lineHeight * 4);

            // Gym Info Text & Address Handling
            if (gymInfo) {
                const tGymName = turkishToEnglish(`Kayitli Salon: ${gymInfo.name}`);
                doc.text(tGymName, rightColX, startY);

                const tAddressLabel = turkishToEnglish("Salon Adresi:");
                doc.text(`${tAddressLabel}`, rightColX, startY + lineHeight);

                const tAddress = turkishToEnglish(gymInfo.address || '-');
                // Wrap address text if it exceeds a certain width (e.g., 80 units)
                const splitAddress = doc.splitTextToSize(tAddress, 80);
                doc.text(splitAddress, rightColX, startY + lineHeight * 2);
            } else {
                doc.text(turkishToEnglish("Kayitli Salon: Bilinmiyor"), rightColX, startY);
            }

            startY += lineHeight * 6;
            // Adjust startY in case address took multiple lines
            if (gymInfo && gymInfo.address && gymInfo.address.length > 40) {
                startY += lineHeight * 2; // Add a bit more buffer just in case
            }

            // --- SECTION 2: Financial Summary ---
            doc.line(15, startY, 195, startY);
            startY += 10;

            doc.setFontSize(14);
            doc.setTextColor(200, 0, 0);
            doc.text(turkishToEnglish("Odeme Ozeti"), 15, startY);
            doc.setTextColor(0);
            doc.setFontSize(10);

            startY += 10;

            const payments = studentInfo.payments || [];
            const activePayments = payments.filter(p => !p.isDeleted);

            const totalPaid = activePayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
            const totalUnpaid = activePayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
            const totalDebt = totalPaid + totalUnpaid;

            doc.text(turkishToEnglish(`Toplam Borc (Planlanan): ${totalDebt.toLocaleString("tr-TR")} TL`), leftColX, startY);
            doc.text(turkishToEnglish(`Odenen Tutar: ${totalPaid.toLocaleString("tr-TR")} TL`), leftColX, startY + lineHeight);
            doc.text(turkishToEnglish(`Kalan Borc: ${totalUnpaid.toLocaleString("tr-TR")} TL`), leftColX, startY + lineHeight * 2);

            startY += lineHeight * 4;

            setProgress(60);

            // --- SECTION 3: Payment History Table ---
            doc.setFontSize(14);
            doc.setTextColor(200, 0, 0);
            doc.text(turkishToEnglish("Odeme Gecmisi ve Taksitler"), 15, startY);
            doc.setTextColor(0);

            // Sorting: Pending first, then Paid
            const sortedPayments = [...activePayments].sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                // If same status, sort by date desc
                return new Date(b.date) - new Date(a.date);
            });

            const tableData = sortedPayments.map(p => [
                new Date(p.date).toLocaleDateString("tr-TR"),
                turkishToEnglish(p.description || "Taksit"),
                `${p.amount} TL`,
                turkishToEnglish(p.status === 'paid' ? 'Odendi' : 'Bekliyor'),
                p.paidDate ? new Date(p.paidDate).toLocaleDateString("tr-TR") : '-'
            ]);

            autoTable(doc, {
                startY: startY + 5,
                head: [[
                    turkishToEnglish('Tarih'),
                    turkishToEnglish('Aciklama'),
                    turkishToEnglish('Tutar'),
                    turkishToEnglish('Durum'),
                    turkishToEnglish('Odenme Tarihi')
                ]],
                body: tableData,
                styles: { font: "Roboto", fontSize: 10 },
                headStyles: { fillColor: [185, 28, 28] }, // Red header
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });

            // Footer
            const finalY = doc.lastAutoTable.finalY + 20;
            doc.setFontSize(8);
            doc.setTextColor(150);
            const footerText = turkishToEnglish("Bu belge TawingTsun Ogrenci Takip Sistemi tarafindan olusturulmustur.");
            doc.text(footerText, 105, 280, null, null, "center");

            const fname = turkishToEnglish(studentInfo.name.replace(/\s+/g, "_"));
            doc.save(`${fname}_Ogrenci_Raporu.pdf`);

            setProgress(100);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Report generation error:", error);
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

                <h2 className="text-xl font-bold mb-6 text-center">Öğrenci Raporu</h2>

                {!studentInfo ? (
                    <div className="text-center py-4">Bilgiler yükleniyor...</div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-600 text-center mb-4">
                                <strong>{studentInfo.name}</strong> için rapor oluşturulacak.
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

export default StudentReportModal;
