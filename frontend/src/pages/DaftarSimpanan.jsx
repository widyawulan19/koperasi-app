import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { fetchMySaving, fetchTotalSavingByType, fetchAllSavings, updateSaving, deleteSaving } from "../Api";

const DaftarSimpanan = () => {
  const { user } = useUser(); // ambil role dari context
  const [savings, setSavings] = useState([]);
  const [totals, setTotals] = useState({ total_wajib: 0, total_pokok: 0 });
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    user_id: "",
    type: "wajib",
    amount: "",
    profit_share: "",
    date: "",
  });

  // Ambil data sesuai role
  useEffect(() => {
    const getSavings = async () => {
      try {
        let response;
        if (user?.role === "admin") {
          response = await fetchAllSavings();
          if (response.success) setSavings(response.data);
        } else {
          response = await fetchMySaving();
          if (response.success) setSavings(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getSavings();
  }, [user]);

  // Hitung total simpanan untuk card ringkasan (karyawan)
  useEffect(() => {
    const getTotals = async () => {
      if (user?.role !== "admin") {
        try {
          const data = await fetchTotalSavingByType();
          setTotals({
            total_wajib: parseFloat(data.total_wajib),
            total_pokok: parseFloat(data.total_pokok),
          });
        } catch (error) {
          console.error(error);
        }
      }
    };
    getTotals();
  }, [user]);

  // Rumus bagi hasil tahunan
  const totalWajib = savings
    .filter((s) => s.type === "wajib")
    .reduce((sum, s) => sum + parseFloat(s.amount), 0);

  const totalBagiHasilTahunan = ((totalWajib * 0.93) * 0.1 / 12) * 0.6;

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  // Modal & action admin
  const handleUpdateClick = (saving) => {
    setSelectedSaving(saving);
    setForm({
      user_id: saving.user_id,
      type: saving.type,
      amount: saving.amount,
      profit_share: saving.profit_share || "",
      date: saving.date,
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!selectedSaving) return;
    const res = await updateSaving(selectedSaving.id, form);
    if (res.success) {
      setSavings(prev =>
        prev.map(s => (s.id === selectedSaving.id ? res.saving : s))
      );
      setShowModal(false);
      setSelectedSaving(null);
    }
  };

  const handleDelete = async (id) => {
    if (alert("Yakin ingin menghapus simpanan ini?")) return;
    const res = await deleteSaving(id);
    if (res.success) {
      setSavings(prev => prev.filter(s => s.id !== id));
    }
  };

  // fungsi handle show detail 
  const handleDetailClick = (data) => {
    setDetailData(data);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };

  const calculateBagiHasil = (type, amount) => {
    if (type === "wajib") return ((parseFloat(amount) * 0.93) * 0.1 / 12) * 0.6;
    return 0;
  };

  return (
    <div className="p-6">
      {/* Card Ringkasan untuk Karyawan */}
      {user?.role !== "admin" && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Ringkasan Simpanan</h2>
          <div className="flex gap-4">
            <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center shadow">
              <h3 className="font-semibold mb-2">Simpanan Wajib</h3>
              <p className="text-lg font-bold">{formatRupiah(totals.total_wajib)}</p>
            </div>
            <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center shadow">
              <h3 className="font-semibold mb-2">Simpanan Pokok</h3>
              <p className="text-lg font-bold">{formatRupiah(totals.total_pokok)}</p>
            </div>
            <div className="flex-1 bg-gray-100 p-4 rounded-lg text-center shadow">
              <h3 className="font-semibold mb-2">Total Bagi Hasil Tahunan</h3>
              <p className="text-lg font-bold">{formatRupiah(totalBagiHasilTahunan)}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        Daftar Simpanan {user?.role === "admin" ? "" : ""}
      </h2>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border-b">Bulan</th>
            <th className="text-left px-4 py-2 border-b">Jenis Simpanan</th>
            <th className="text-right px-4 py-2 border-b">Besar Simpanan</th>
            <th className="text-right px-4 py-2 border-b">Total Bagi Hasil Tahunan</th>
            {user?.role === "admin" && <th className="text-center px-4 py-2 border-b">Action</th>}
          </tr>
        </thead>
        <tbody>
          {savings.map((s) => {
            const bulan = new Date(s.date).toLocaleString("id-ID", { month: "long" });
            return (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{bulan}</td>
                <td className="px-4 py-2 border-b capitalize">{s.type}</td>
                <td className="px-4 py-2 border-b text-right">
                  {parseFloat(s.amount).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                </td>
                <td className="px-4 py-2 border-b text-right">
                  {user?.role === "admin"
                    ? calculateBagiHasil(s.type, s.amount).toLocaleString("id-ID", { style: "currency", currency: "IDR" })
                    : totalBagiHasilTahunan.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                </td>
                {user?.role === "admin" && (
                  <td className="px-4 py-2 border-b text-center">
                    <button onClick={() => handleUpdateClick(s)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Update</button>
                    <button onClick={() => handleDelete(s.id)} className="bg-red-500 text-white px-2 py-1 rounded mr-2">Delete</button>
                    <button onClick={() => handleDetailClick(s)} className="bg-gray-500 text-white px-2 py-1 rounded">Detail</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* modal detail data  */}
      {showDetail && detailData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Detail Simpanan</h3>
            <div className="flex flex-col gap-2">
              <label>ID</label>
              <input value={detailData.id} disabled className="border p-2 rounded w-full" />

              <label>User ID</label>
              <input value={detailData.user_id} disabled className="border p-2 rounded w-full" />

              <label>Nama User</label>
              <input value={detailData.user?.name || "-"} disabled className="border p-2 rounded w-full" />

              <label>Jenis Simpanan</label>
              <input value={detailData.type} disabled className="border p-2 rounded w-full" />

              <label>Jumlah Simpanan</label>
              <input value={parseFloat(detailData.amount).toLocaleString("id-ID", { style: "currency", currency: "IDR" })} disabled className="border p-2 rounded w-full" />

              <label>Profit Share</label>
              <input value={parseFloat(detailData.profit_share).toLocaleString("id-ID", { style: "currency", currency: "IDR" })} disabled className="border p-2 rounded w-full" />

              <label>Tanggal</label>
              <input value={detailData.date} disabled className="border p-2 rounded w-full" />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseDetail}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal Update Admin */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Update Simpanan</h3>
            <div className="flex flex-col gap-2">
              <label>User ID</label>
              <input type="number" name="user_id" value={form.user_id} onChange={handleChange} className="border p-2 rounded w-full" />
              <label>Jenis Simpanan</label>
              <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full">
                <option value="wajib">Wajib</option>
                <option value="pokok">Pokok</option>
              </select>
              <label>Besar Simpanan</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} className="border p-2 rounded w-full" />
              <label>Profit Share</label>
              <input type="number" name="profit_share" value={form.profit_share || ""} onChange={handleChange} className="border p-2 rounded w-full" />
              <label>Tanggal</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarSimpanan;
