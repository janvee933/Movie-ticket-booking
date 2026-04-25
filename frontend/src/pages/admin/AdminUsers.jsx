import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const AdminUsers = () => {
    const { adminToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const token = adminToken || localStorage.getItem('admin_token');
            const res = await fetch('/api/admin/users', {
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
    }, []);

    const toggleStatus = async (id) => {
        try {
            const token = adminToken || localStorage.getItem('admin_token');
            const res = await fetch(`/api/admin/users/${id}/status`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="admin-page-container">Loading users...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1 className="admin-title">User Management</h1>
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
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="fw-bold">{user.name}</span>
                                    </div>
                                </td>
                                <td><div className="d-flex align-items-center gap-1"><Mail size={14} /> {user.email}</div></td>
                                <td><span className={`badge ${user.role === 'admin' ? 'warning' : 'info'}`}>{user.role}</span></td>
                                <td>
                                    <span className={`badge ${user.status === 'blocked' ? 'danger' : 'success'}`}>
                                        {user.status || 'active'}
                                    </span>
                                </td>
                                <td><div className="d-flex align-items-center gap-1"><Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}</div></td>
                                <td>
                                    <button 
                                        onClick={() => toggleStatus(user._id)} 
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
