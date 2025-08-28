import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar /> {/* Sidebar kiri tetap */}

      <div style={{ flex: 1 }}>
        <Navbar /> {/* Navbar di atas konten */}
        <div style={{ padding: '20px' }}>
          {children} {/* konten halaman, bisa Dashboard, Pinjaman, dll */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
