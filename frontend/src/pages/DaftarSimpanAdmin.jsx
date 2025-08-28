import { useEffect, useState } from "react";
import { fetchAllSavings, updateSaving, deleteSaving } from "../Api";

const DaftarSimpananAdmin = () => {
  const [savings, setSavings] = useState([]);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    user_id: "",
    type: "wajib",
    amount: "",
    profit_share: "",
    date: "",
  });

  // Ambil semua data simpanan (admin)
  useEffect(() => {
    const getSavings = async () => {
      const data = await fetchAllSavings();
      if (data.success) setSavings(data.data);
    };
    getSavings();
  }, []);

  // Rumus bagi hasil tahunan: ((total_wajib * 0.93) * 0.1 / 12) * 0.6
  const calculateBagiHasil = (type, amount) => {
    if (type === "wajib") {
      return ((parseFloat(amount) * 0.93) * 0.1 / 12) * 0.6;
    }
    return 0;
  };

  // Handle Update Button
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

  // Handle Form Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Update
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

  // Handle Delete
  const handleDelete = async (id) => {
    if (alert("Yakin ingin menghapus simpanan ini?")) return;
    const res = await deleteSaving(id);
    if (res.success) {
      setSavings(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Daftar Simpanan (Admin)</h2>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border-b">Bulan</th>
            <th className="text-left px-4 py-2 border-b">Jenis Simpanan</th>
            <th className="text-right px-4 py-2 border-b">Besar Simpanan</th>
            <th className="text-right px-4 py-2 border-b">Total Bagi Hasil Tahunan</th>
            <th className="text-left px-4 py-2 border-b">Action</th>
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
                  {calculateBagiHasil(s.type, s.amount).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleUpdateClick(s)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => alert(JSON.stringify(s, null, 2))}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal Update */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Update Simpanan</h3>
            <div className="flex flex-col gap-2">
              <label>User ID</label>
              <input
                type="number"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />

              <label>Jenis Simpanan</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="wajib">Wajib</option>
                <option value="pokok">Pokok</option>
              </select>

              <label>Besar Simpanan</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />

              <label>Profit Share</label>
              <input
                type="number"
                name="profit_share"
                value={form.profit_share || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />

              <label>Tanggal</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarSimpananAdmin;
