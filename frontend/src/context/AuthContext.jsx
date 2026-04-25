import React, { createContext, useContext, useState, useEffect } from 'react';

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

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState(null);

    // Sync state across tabs - updated for dual sessions
    useEffect(() => {
        const handleStorageChange = (e) => {
            const keys = ['token', 'user', 'admin_token', 'admin_user'];
            if (keys.includes(e.key)) {
                setUser(safeParse('user', null));
                setToken(localStorage.getItem('token'));
                setAdmin(safeParse('admin_user', null));
                setAdminToken(localStorage.getItem('admin_token'));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (userData, userToken) => {
        if (userData.role === 'admin') {
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

    const logout = (role = 'user') => {
        if (role === 'admin') {
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
        isAuthenticated: !!token,
        isAdminAuthenticated: !!adminToken,
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
