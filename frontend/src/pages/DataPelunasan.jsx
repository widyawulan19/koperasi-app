import { useEffect, useState } from "react";
import { fetchLoanPayments, updateLoanPaymentStatus } from "../Api";

const DataPelunasan = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const getPayments = async () => {
      const data = await fetchLoanPayments();
      setPayments(data.data);
    };
    getPayments();
  }, []);

  const handleApprove = async (id) => {
    await updateLoanPaymentStatus(id, "approved");
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
  };

  const handleReject = async (id) => {
    await updateLoanPaymentStatus(id, "rejected");
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Data Pelunasan</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Tanggal Pelunasan</th>
              <th className="border px-4 py-2 text-left">Nama Karyawan</th>
              <th className="border px-4 py-2 text-left">Besar Pinjaman</th>
              <th className="border px-4 py-2 text-left">Bukti Transfer</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {new Date(payment.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="border px-4 py-2">{payment.loan.user.name}</td>
                <td className="border px-4 py-2">
                  {parseFloat(payment.amount).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                </td>
                <td className="border px-4 py-2">
                  {payment.bukti_transfer ? (
                    <a
                      href={payment.bukti_transfer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Lihat Bukti
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="border px-4 py-2 capitalize">{payment.status}</td>
                <td className="border px-4 py-2">
                  {payment.status === "applied" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(payment.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(payment.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {payment.status === "approved" && (
                    <span className="text-green-600 font-semibold">Approved</span>
                  )}
                  {payment.status === "rejected" && (
                    <span className="text-red-600 font-semibold">Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPelunasan;
