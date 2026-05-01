import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const AdminUsers = () => {
    const { admin, adminToken, superAdmin, superAdminToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const isSuperAdmin = (admin?.role === 'superadmin') || (superAdmin?.role === 'superadmin');

    const fetchUsers = async () => {
        try {
            const token = isSuperAdmin ? (superAdminToken || localStorage.getItem('superadmin_token')) : (adminToken || localStorage.getItem('admin_token'));
            const endpoint = isSuperAdmin ? '/api/users' : '/api/admin/users';
            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [isSuperAdmin]);

    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = isSuperAdmin ? (superAdminToken || localStorage.getItem('superadmin_token')) : (adminToken || localStorage.getItem('admin_token'));
            const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
            const endpoint = isSuperAdmin ? `/api/users/${id}/status` : `/api/admin/users/${id}/status`;
            const method = isSuperAdmin ? 'PUT' : 'PATCH';

            const res = await fetch(endpoint, {
                method: method,
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: isSuperAdmin ? JSON.stringify({ status: newStatus }) : null
            });
            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if (!isSuperAdmin) return;
        try {
            const token = isSuperAdmin ? (superAdminToken || localStorage.getItem('superadmin_token')) : (adminToken || localStorage.getItem('admin_token'));
            const res = await fetch(`/api/users/${id}/role`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || 
                             user.email?.toLowerCase().includes(search.toLowerCase());
        
        // Dynamic Filtering based on URL path
        const path = window.location.pathname;
        if (path.includes('/admins')) {
            return matchesSearch && (user.role === 'admin' || user.role === 'superadmin');
        } else if (path.includes('/users')) {
            return matchesSearch && user.role === 'user';
        }
        
        return matchesSearch;
    }) : [];

    if (loading) return <div className="admin-page-container">Loading users...</div>;

    const pageTitle = window.location.pathname.includes('/admins') ? 'Admin Management' : 'User Management';

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1 className="admin-title">{pageTitle}</h1>
                {isSuperAdmin && <span className="badge warning ms-2 text-uppercase" style={{ fontSize: '0.7rem' }}>SuperAdmin Mode</span>}
            </div>

            <div className="admin-toolbar">
                <div className="search-bar">
                    <Search size={20} />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search users by name or email..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="user-avatar-mini me-2">
                                            {user.name?.charAt(0) || '?'}
                                        </div>
                                        <span className="fw-bold">{user.name}</span>
                                    </div>
                                </td>
                                <td><div className="d-flex align-items-center gap-1"><Mail size={14} /> {user.email}</div></td>
                                <td>
                                    {isSuperAdmin ? (
                                        <select 
                                            className="form-select form-select-sm bg-dark text-white border-secondary"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            style={{ width: 'auto' }}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="superadmin">SuperAdmin</option>
                                        </select>
                                    ) : (
                                        <span className={`badge ${user.role === 'admin' ? 'warning' : 'info'}`}>{user.role}</span>
                                    )}
                                </td>
                                <td>
                                    <span className={`badge ${user.status === 'blocked' ? 'danger' : 'success'}`}>
                                        {user.status || 'active'}
                                    </span>
                                </td>
                                <td><div className="d-flex align-items-center gap-1"><Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}</div></td>
                                <td>
                                    <button 
                                        onClick={() => toggleStatus(user._id, user.status)} 
                                        className={`btn-icon ${user.status === 'blocked' ? 'edit' : 'delete'}`}
                                        title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}
                                    >
                                        {user.status === 'blocked' ? <UserCheck size={18} /> : <UserX size={18} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
