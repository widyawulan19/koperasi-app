import React, { useState, useEffect } from "react";
import { fetchLoans, updateStatusLoan } from "../Api";

const DataPinjaman = () => {
  const [pinjamanData, setPinjamanData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPinjaman = async () => {
    try {
      const res = await fetchLoans();
      // mapping sesuai struktur data dari backend
      const loans = res.map((loan) => ({
        id: loan.id,
        tanggal: new Date(loan.created_at).toLocaleDateString("id-ID"),
        nama: loan.user_name,
        phone: loan.phone || "-",
        address: loan.address || "-",
        besar: parseFloat(loan.amount),
        status: loan.status,
        approved_by: loan.approved_by || "-", // backend belum ngirim nama admin, jadi sementara
      }));
      setPinjamanData(loans);
      setLoading(false);
    } catch (err) {
      console.error("Gagal fetch data pinjaman:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPinjaman();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await updateStatusLoan(id, status); // pastikan API POST ke /loans/{id}/approve atau /reject
      // update state sesuai loan baru
      setPinjamanData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: res.loan.status,
                approved_by: "Admin", // sementara karena backend belum kirim nama
              }
            : item
        )
      );
    } catch (err) {
      console.error("Gagal update status pinjaman:", err.response || err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Data Pinjaman</h2>
      <div className="max-h-[500px] overflow-auto border border-gray-200 rounded-lg">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border-b">Tanggal Pengajuan</th>
            <th className="px-4 py-2 border-b">Nama Karyawan</th>
            <th className="px-4 py-2 border-b">Besar Pinjaman</th>
            <th className="px-4 py-2 border-b">No Telepon</th>
            <th className="px-4 py-2 border-b">Alamat</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {pinjamanData.map((pinjaman) => (
            <tr key={pinjaman.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{pinjaman.tanggal}</td>
              <td className="px-4 py-2 border-b">{pinjaman.nama}</td>
              <td className="px-4 py-2 border-b text-right">
                {pinjaman.besar.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
              <td className="px-4 py-2 border-b">{pinjaman.phone}</td>
              <td className="px-4 py-2 border-b">{pinjaman.address}</td>
              <td className="px-4 py-2 border-b capitalize">{pinjaman.status}</td>
              <td className="px-4 py-2 border-b flex gap-2">
                {pinjaman.status === "applied" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      onClick={() => handleUpdateStatus(pinjaman.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleUpdateStatus(pinjaman.id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {pinjaman.status === "approved" && (
                  <span className="text-green-600 font-semibold">Approved</span>
                )}
                {pinjaman.status === "rejected" && (
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

export default DataPinjaman;
