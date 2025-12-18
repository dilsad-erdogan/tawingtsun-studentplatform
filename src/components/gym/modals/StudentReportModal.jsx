import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSelector } from "react-redux";
import { FileText, Download, X } from "lucide-react";

const StudentReportModal = ({ isOpen, onClose, gymId }) => {
    const { students } = useSelector((state) => state.student);
    const { gyms } = useSelector((state) => state.gym);

    const [selectedGroup, setSelectedGroup] = useState("Çocuk");

    // Convert Turkish characters for PDF
    const turkishToEnglish = (text) => {
        return text
            .replace(/Ğ/g, "G").replace(/ğ/g, "g")
            .replace(/Ü/g, "U").replace(/ü/g, "u")
            .replace(/Ş/g, "S").replace(/ş/g, "s")
            .replace(/İ/g, "I").replace(/ı/g, "i")
            .replace(/Ö/g, "O").replace(/ö/g, "o")
            .replace(/Ç/g, "C").replace(/ç/g, "c");
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Find current gym name
        const currentGym = gyms.find(g => g.id === gymId);
        const gymName = currentGym ? turkishToEnglish(currentGym.name) : "Spor Salonu";

        // Filter students
        const filteredStudents = students.filter(
            (s) => s.gymId === gymId && s.group === selectedGroup && s.isActive
        );

        // Sort by level (descending) then name
        filteredStudents.sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));

        // Title
        doc.setFontSize(18);
        doc.text(`${gymName} - ${turkishToEnglish(selectedGroup)} Ogrenci Raporu`, 14, 22);

        doc.setFontSize(11);
        doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`, 14, 30);

        // Table Data
        const tableData = filteredStudents.map((student, index) => [
            index + 1,
            turkishToEnglish(student.name),
            student.level
        ]);

        autoTable(doc, {
            startY: 40,
            head: [['No', 'Ad Soyad', 'Seviye']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38] }, // Red header
        });

        doc.save(`${gymName}_${turkishToEnglish(selectedGroup)}_Raporu.pdf`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm animate-scaleIn">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-red-600" />
                        Öğrenci Raporu
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Raporlanacak Grubu Seçin:
                    </label>
                    <div className="space-y-2">
                        {["Çocuk", "Kadın", "Erkek"].map((group) => (
                            <label key={group} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <input
                                    type="radio"
                                    name="group"
                                    value={group}
                                    checked={selectedGroup === group}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-gray-800 font-medium">{group}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                        İptal
                    </button>
                    <button
                        onClick={generatePDF}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2 shadow"
                    >
                        <Download className="w-4 h-4" />
                        PDF İndir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentReportModal;
