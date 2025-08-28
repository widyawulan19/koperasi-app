import React, { useState, useEffect } from "react";
import { fetchUsers, addLoan } from "../Api";

const FormPinjaman = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    tanggal: "",
    amount: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ambil daftar user
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetchUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.log(err);
        setUsers([]);
      }
    };
    getUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = {
        user_id: form.user_id,
        amount: form.amount,
        tanggal: form.tanggal,
        phone: form.phone,
        address: form.address,
      };
      await addLoan(payload);
      setSuccess("Pinjaman berhasil ditambahkan!");
      setForm({ user_id: "", tanggal: "", amount: "", phone: "", address: "" });
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Form Pinjaman</h2>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
      )}
      {success && (
        <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Tanggal Pengajuan
          </label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nama Karyawan
          </label>
          <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Pilih Karyawan --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Besar Pinjaman
          </label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            placeholder="Masukkan jumlah pinjaman"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            No Telepon
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="08123456789"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Alamat
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Masukkan alamat lengkap"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPinjaman;
