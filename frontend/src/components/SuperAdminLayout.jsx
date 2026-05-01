import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, LogOut, Settings, BarChart2, ShieldAlert, Monitor, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const SuperAdminLayout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout('superadmin');
        navigate('/home');
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar" style={{ borderRight: '2px solid var(--color-warning)' }}>
                <div className="admin-logo">
                    <h2 className="text-warning"><ShieldAlert className="me-2" /> SuperAdmin</h2>
                </div>
                <nav className="admin-nav">
                    <NavLink to="/superadmin" end className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> System Overview
                    </NavLink>
                    <NavLink to="/superadmin/users" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <Users size={20} /> Manage Users
                    </NavLink>
                    <NavLink to="/superadmin/admins" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <UserCog size={20} /> Manage Admins
                    </NavLink>
                    <NavLink to="/superadmin/theaters" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <Monitor size={20} /> Manage Theaters
                    </NavLink>
                    <NavLink to="/superadmin/reports" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <BarChart2 size={20} /> System Reports
                    </NavLink>
                    <NavLink to="/superadmin/payments" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <CreditCard size={20} /> Payments & Refunds
                    </NavLink>
                    <NavLink to="/superadmin/settings" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <Settings size={20} /> Settings
                    </NavLink>
                </nav>
                <div className="mt-auto p-3">
                    <NavLink to="/admin" className="btn btn-outline-light btn-sm w-100 mb-2">
                         Go to Regular Admin
                    </NavLink>
                    <button onClick={handleLogout} className="admin-logout w-100">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default SuperAdminLayout;
