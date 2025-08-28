import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { fetchPendingLoans, fetchTotalLoan, fetchTotalSaving } from '../Api';

const Dashboard = () => {
  const { user } = useUser();

  const [totalSaving, setTotalSaving] = useState(0);
  const [totalLoan, setTotalLoan] = useState(0);
  const [pendingLoans, setPendingLoans] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fungsi format Rupiah
  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [savingData, loanData, pendingData] = await Promise.all([
          fetchTotalSaving(),
          fetchTotalLoan(),
          fetchPendingLoans()
        ]);

        setTotalSaving(savingData.total_saving);
        setTotalLoan(loanData.total_loan);
        setPendingLoans(pendingData.pending_loans);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6">
      {/* Ucapan selamat datang */}
      <h1 className="text-2xl font-bold mb-2">
        Selamat datang kembali {user?.role === 'admin' ? 'Admin' : user?.name || 'Pengguna'}!
      </h1>
      <p className="text-gray-600 mb-6">Status Pekerja: {user?.role || '-'}</p>

      {/* Card ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold mb-2">Jumlah Simpanan</h2>
          <p className="text-xl font-bold">{formatRupiah(totalSaving)}</p>
        </div>

        <div className="bg-green-100 p-6 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold mb-2">Jumlah Pinjaman</h2>
          <p className="text-xl font-bold">{formatRupiah(totalLoan)}</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold mb-2">Pinjaman Belum Lunas</h2>
          <p className="text-xl font-bold">{pendingLoans} Pinjaman</p>
        </div>

        {/* Contoh tambahan untuk admin */}
        {user?.role === 'admin' && (
          <div className="bg-purple-100 p-6 rounded-lg text-center shadow md:col-span-3">
            <h2 className="text-lg font-semibold mb-2">Ringkasan Admin</h2>
            <p className="text-gray-700">Di sini admin bisa melihat semua data pengguna, simpanan, pinjaman, dan statistik lainnya.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
