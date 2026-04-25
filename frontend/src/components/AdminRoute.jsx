import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { admin, isAdminAuthenticated } = useAuth();

    if (!isAdminAuthenticated || admin?.role !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
