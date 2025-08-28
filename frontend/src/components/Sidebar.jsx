import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const { user } = useUser(); // ambil user dari context
  const location = useLocation();

  if (!user) return null; // jangan render sebelum login

  const menuKaryawan = [
    { name: 'Dashboard', path:'/'},
    { name: 'Pinjaman', path: '/pinjaman' },
    { name: 'Daftar Pinjaman', path: '/daftar-pinjaman' },
    { name: 'Daftar Simpanan', path: '/daftar-simpanan' },
  ];

  const menuAdmin = [
    { name: 'Data Pinjaman', path: '/data-pinjaman' },
    { name: 'Data Pelunasan', path: '/data-pelunasan' },
    { name: 'Daftar Simpanan', path: '/daftar-simpanan' },
    // {name: 'Daftar Simpan', path:'/daftar-simpanan-admin'},
    { name: 'Tambah Simpanan', path: '/tambah-simpanan' },
  ];

  const menus = user.role === 'admin' ? menuAdmin : menuKaryawan;

  return (
    <aside style={{ width: '220px', padding: '20px', borderRight: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
      <h3 style={{ marginBottom: '20px' }}>Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menus.map((menu) => (
          <li key={menu.path} style={{ marginBottom: '15px' }}>
            <Link
              to={menu.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === menu.path ? '#fff' : '#333',
                backgroundColor: location.pathname === menu.path ? '#4f46e5' : 'transparent',
                padding: '8px 12px',
                borderRadius: '4px',
                display: 'block',
              }}
            >
              {menu.name}
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#555' }}>
        Logged in as: <strong>{user.name}</strong>
      </div>
    </aside>
  );
};

export default Sidebar;
