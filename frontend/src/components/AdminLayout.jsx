import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, Monitor, Calendar, BookOpen, LogOut, Tag, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { logout, admin, superAdmin } = useAuth();

    const handleLogout = () => {
        logout('admin');
        navigate('/home');
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>{admin?.role === 'superadmin' ? 'SuperAdmin Panel' : 'Admin Panel'}</h2>
                </div>
                <nav className="admin-nav">
                    {(admin?.role === 'superadmin' || superAdmin) && (
                        <NavLink to="/superadmin" className="admin-link superadmin-switch mb-4" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.2)', fontWeight: 'bold' }}>
                            <LayoutDashboard size={20} /> Back to SuperAdmin
                        </NavLink>
                    )}
                    <NavLink to="/admin" end className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/admin/movies" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <Film size={20} /> Movies
                    </NavLink>
                    <NavLink to="/admin/theaters" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <Monitor size={20} /> Theaters
                    </NavLink>
                    <NavLink to="/admin/showtimes" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <Calendar size={20} /> Showtimes
                    </NavLink>
                    <NavLink to="/admin/bookings" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <BookOpen size={20} /> Bookings
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <Users size={20} /> Users
                    </NavLink>
                    <NavLink to="/admin/reports" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <TrendingUp size={20} /> Reports
                    </NavLink>
                    <NavLink to="/admin/offers" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
                        <Tag size={20} /> Offers
                    </NavLink>
                </nav>
                <button onClick={handleLogout} className="admin-logout">
                    <LogOut size={20} /> Logout
                </button>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
