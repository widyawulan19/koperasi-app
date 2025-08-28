import { useEffect, useState } from "react";
import { fetchMyLoans } from "../Api";

const DaftarPinjaman = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [buktiFile, setBuktiFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getLoans = async () => {
      const data = await fetchMyLoans();
      setLoans(data);
    };
    getLoans();
  }, []);

  const handleLunasiClick = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setBuktiFile(e.target.files[0]);
  };

  const handleSubmitBukti = () => {
    if (!buktiFile) {
      alert("Pilih file bukti transfer terlebih dahulu!");
      return;
    }
    // TODO: kirim file ke backend pakai API endpoint bayar pinjaman
    console.log("Kirim bukti transfer untuk loan id:", selectedLoan.id, buktiFile);
    setShowModal(false);
    setBuktiFile(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Daftar Pinjaman</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left border-b">Tanggal Pengajuan</th>
              <th className="py-2 px-4 text-left border-b">Besar Pinjaman</th>
              <th className="py-2 px-4 text-left border-b">Status</th>
              <th className="py-2 px-4 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{new Date(loan.created_at).toLocaleDateString("id-ID")}</td>
                <td className="py-2 px-4 border-b">
                  {parseFloat(loan.amount).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td className="py-2 px-4 border-b capitalize">{loan.status}</td>
                <td className="py-2 px-4 border-b">
                  {(loan.status === "approved" || loan.status === "pending") ? (
                    <button
                      onClick={() => handleLunasiClick(loan)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Lunasi
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Upload Bukti Transfer */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Upload Bukti Transfer</h3>
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitBukti}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
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

export default DaftarPinjaman;
