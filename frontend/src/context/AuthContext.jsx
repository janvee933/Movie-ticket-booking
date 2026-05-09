import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // Safe JSON parse helper
    const safeParse = (key, fallback) => {
        const item = localStorage.getItem(key);
        if (!item || item === 'undefined' || item === 'null') return fallback;
        try {
            return JSON.parse(item);
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            localStorage.removeItem(key); // Clear corrupted data
            return fallback;
        }
    };

    // Separate states for general User and Admin
    // 'user' and 'token' are for the public site/customer experience
    // 'admin' and 'admin_token' are strictly for the Admin Panel
    const [user, setUser] = useState(() => safeParse('user', null));
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [admin, setAdmin] = useState(() => safeParse('admin_user', null));
    const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token'));

    const [superAdmin, setSuperAdmin] = useState(() => safeParse('superadmin_user', null));
    const [superAdminToken, setSuperAdminToken] = useState(localStorage.getItem('superadmin_token'));

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState(null);

    // Periodic session validation to sync roles from backend
    useEffect(() => {
        const validateSession = async () => {
            const sessions = [
                { key: 'user', token: localStorage.getItem('token') },
                { key: 'admin', token: localStorage.getItem('admin_token') },
                { key: 'superadmin', token: localStorage.getItem('superadmin_token') }
            ];

            for (const session of sessions) {
                if (!session.token) continue;

                try {
                    const res = await fetch(`${API_URL}/api/auth/me`, {
                        headers: { 'Authorization': `Bearer ${session.token}` }
                    });

                    if (res.ok) {
                        // Success - session is valid
                    } else if (res.status === 401) {
                        console.warn(`Auth: Session for ${session.key} expired (401). Logging out.`);
                        logout(session.key);
                    }
                } catch (error) {
                    console.debug(`Auth: Network check skipped for ${session.key}`);
                }
            }
        };

        validateSession();
        const interval = setInterval(validateSession, 10000); // 10s is plenty for background sync
        return () => clearInterval(interval);
    }, []);

    // (Cross-tab sync disabled for strict session isolation as requested)

    const clearAllSessions = () => {
        setUser(null);
        setToken(null);
        setAdmin(null);
        setAdminToken(null);
        setSuperAdmin(null);
        setSuperAdminToken(null);

        const keys = ['token', 'user', 'admin_token', 'admin_user', 'superadmin_token', 'superadmin_user'];
        keys.forEach(key => localStorage.removeItem(key));
    };

    const login = (userData, userToken) => {
        // Identity Check: If a different user ID is logging in, 
        // we MUST clear all previous sessions for security.
        const currentUserId = (user?.id || user?._id) || (admin?.id || admin?._id) || (superAdmin?.id || superAdmin?._id);
        const newUserId = userData.id || userData._id;

        if (currentUserId && currentUserId !== newUserId) {
            console.log("Identity mismatch: clearing previous user sessions.");
            clearAllSessions();
        }

        // Additive Login: Strictly set only the bucket for the role returned
        if (userData.role === 'superadmin') {
            setSuperAdmin(userData);
            setSuperAdminToken(userToken);
            localStorage.setItem('superadmin_user', JSON.stringify(userData));
            localStorage.setItem('superadmin_token', userToken);
        } else if (userData.role === 'admin') {
            setAdmin(userData);
            setAdminToken(userToken);
            localStorage.setItem('admin_user', JSON.stringify(userData));
            localStorage.setItem('admin_token', userToken);
        } else {
            setUser(userData);
            setToken(userToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', userToken);
        }
    };

    const logout = (role = 'all') => {
        if (role === 'all') {
            clearAllSessions();
        } else if (role === 'superadmin') {
            setSuperAdmin(null);
            setSuperAdminToken(null);
            localStorage.removeItem('superadmin_user');
            localStorage.removeItem('superadmin_token');
        } else if (role === 'admin') {
            setAdmin(null);
            setAdminToken(null);
            localStorage.removeItem('admin_user');
            localStorage.removeItem('admin_token');
        } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    const openAuthModal = (path = null) => {
        setRedirectPath(path);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        setRedirectPath(null);
    };

    const value = {
        user,
        token,
        admin,
        adminToken,
        superAdmin,
        superAdminToken,
        isAuthenticated: !!token,
        isAdminAuthenticated: !!adminToken,
        isSuperAdminAuthenticated: !!superAdminToken,
        isAuthModalOpen,
        redirectPath,
        login,
        logout,
        openAuthModal,
        closeAuthModal
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
