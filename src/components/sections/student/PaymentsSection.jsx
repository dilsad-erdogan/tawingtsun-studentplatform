import { useSelector } from "react-redux";

const PaymentsSection = () => {
  const user = useSelector((state) => state.user.data);

  if (!user) return <p>Giriş yapılmadı.</p>;
  if (!user.payments || user.payments.length === 0) {
    return <p>Hiç ödeme bulunamadı.</p>;
  }

  const sortedPayments = [...user.payments].sort(
    (a, b) => new Date(b.entryDate) - new Date(a.entryDate)
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ödeme Geçmişim</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Tarih</th>
            <th className="border px-3 py-2">Ücret</th>
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