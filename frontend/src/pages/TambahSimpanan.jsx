import { useState } from "react";
import { useUser } from "../context/UserContext";
import { createSaving } from "../Api";

const TambahSimpananForm = ({ onSuccess }) => {
  const { user } = useUser();

  const [date, setDate] = useState("");
  const [nominalWajib, setNominalWajib] = useState("");
  const [nominalPokok, setNominalPokok] = useState("");
  const [loading, setLoading] = useState(false);

  // Rumus bagi hasil tahunan
  const calculateBagiHasil = (totalWajib) => {
    return ((parseFloat(totalWajib || 0) * 0.93) * 0.1 / 12) * 0.6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") {
      alert("Hanya admin yang bisa menambah simpanan");
      return;
    }
    if (!date || !nominalWajib || !nominalPokok) {
      alert("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    try {
      // Simpan Simpanan Wajib
      await createSaving({
        user_id: user.id, // kalau admin bisa pilih user_id, tapi default sekarang ambil admin sendiri
        type: "wajib",
        amount: nominalWajib,
        profit_share: calculateBagiHasil(nominalWajib),
        date,
      });

      // Simpan Simpanan Pokok
      await createSaving({
        user_id: user.id,
        type: "pokok",
        amount: nominalPokok,
        profit_share: 0, // pokok tidak ada bagi hasil
        date,
      });

      alert("Simpanan berhasil ditambahkan!");
      setDate("");
      setNominalWajib("");
      setNominalPokok("");
      if (onSuccess) onSuccess(); // callback untuk refresh data
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan simpanan");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="p-6 bg-white shadow rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Tambah Simpanan</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>Tanggal / Bulan / Tahun</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        <label>Nominal Simpanan Wajib</label>
        <input
          type="number"
          value={nominalWajib}
          onChange={(e) => setNominalWajib(e.target.value)}
          className="border p-2 rounded"
        />

        <label>Nominal Simpanan Pokok</label>
        <input
          type="number"
          value={nominalPokok}
          onChange={(e) => setNominalPokok(e.target.value)}
          className="border p-2 rounded"
        />

        <label>Total Bagi Hasil Tahunan</label>
        <input
          type="text"
          value={calculateBagiHasil(nominalWajib).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
          disabled
          className="border p-2 rounded bg-gray-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
        >
          {loading ? "Menyimpan..." : "Submit"}
        </button>
      </form>
    </div>
  </div>
);
}

export default TambahSimpananForm;
