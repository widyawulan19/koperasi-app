import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleShowDropdown = () =>{
    setShowDropdown(!showDropdown);
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-end items-center p-4 bg-gray-200">
      <div className="relative">
        <h4
          className="cursor-pointer font-semibold text-gray-700"
          onClick={handleShowDropdown}
        >
          Selamat datang, {user?.name || 'Pengguna'}
        </h4>

        {showDropdown && (
          <div className="absolute top-full mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button
              className="w-full text-center px-4 py-2 hover:bg-red-300 text-red-500 rounded-lg flex items-center justify-center gap-1"
              onClick={handleLogout}
            >
              <IoMdLogOut />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>

  );
};

export default Navbar;
