import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SuperAdminRoute = () => {
    const { superAdmin, isSuperAdminAuthenticated } = useAuth();

    if (!isSuperAdminAuthenticated || superAdmin?.role !== 'superadmin') {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default SuperAdminRoute;
