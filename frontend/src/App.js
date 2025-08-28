import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './pages/DashboardLayout';
import Dashboard from './pages/Dashboard'
import Pinjaman from './pages/Pinjaman'
import DataPinjaman from './pages/DataPinjaman'
import DataPelunasan from './pages/DataPelunasan'
import DaftarSimpanan from './pages/DaftarSimpanan'
import TambahSimpanan from './pages/TambahSimpanan'
import DaftarPinjaman from './pages/DaftarPinjaman'
import Navbar from './components/Navbar';
import DaftarSimpananAdmin from './pages/DaftarSimpanAdmin';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <ProtectedRoute allowedRoles={['karyawan', 'admin']}>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/pinjaman" element={
        <ProtectedRoute allowedRoles={['karyawan']}>
          <DashboardLayout>
            <Pinjaman />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/daftar-pinjaman" element={
        <ProtectedRoute allowedRoles={['karyawan']}>
          <DashboardLayout>
            <DaftarPinjaman />
          </DashboardLayout>
        </ProtectedRoute>
      } />


      <Route path="/data-pinjaman" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout>
            <DataPinjaman />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/data-pelunasan" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout>
            <DataPelunasan />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* <Route path="/daftar-simpanan-admin" element={
        <ProtectedRoute allowedRoles={['admin', 'karyawan']}>
          <DashboardLayout>
            <DaftarSimpananAdmin />
          </DashboardLayout>
        </ProtectedRoute>
      } /> */}
      <Route path="/daftar-simpanan" element={
        <ProtectedRoute allowedRoles={['admin', 'karyawan']}>
          <DashboardLayout>
            <DaftarSimpanan />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/tambah-simpanan" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout>
            <TambahSimpanan />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* dst */}
    </Routes>

  );
}

export default App;
