import { useSelector } from "react-redux";
import { useState } from "react";

const PaymentsSection = () => {
  const user = useSelector((state) => state.user.data);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  if (!user) return <p>Giriş yapılmadı.</p>;
  if (!user.payments || user.payments.length === 0) {
    return <p>Hiç ödeme bulunamadı.</p>;
  }

  const sortedPayments = [...user.payments].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.entryDate) - new Date(b.entryDate)
        : new Date(b.entryDate) - new Date(a.entryDate);
    } else if (sortBy === "salary") {
      return sortOrder === "asc"
        ? Number(a.salary) - Number(b.salary)
        : Number(b.salary) - Number(a.salary);
    }
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="m-10 p-4">
      <h2 className="text-xl font-bold mb-4">Ödeme Geçmişim</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("date")}>
              Tarih {sortBy === "date" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="border px-3 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("salary")}>
              Ücret {sortBy === "salary" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="border px-3 py-2">Durum</th>
          </tr>
        </thead>
        <tbody>
          {sortedPayments.map((payment, idx) => (
            <tr key={idx}>
              <td className="border px-3 py-2">{payment.entryDate}</td>
              <td className="border px-3 py-2">{payment.salary} ₺</td>
              <td className="border px-3 py-2 text-center">
                {payment.paymentStatus ? (
                  <span className="text-green-600 font-semibold">✅ Ödendi</span>
                ) : (
                  <span className="text-red-600 font-semibold">❌ Bekliyor</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsSection;
