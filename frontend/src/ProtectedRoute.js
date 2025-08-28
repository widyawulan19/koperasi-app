import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();

    // tunggu user load dari localStorage
    if (user === null) return null; // atau spinner loading

    // cek role
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
