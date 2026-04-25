import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import ScrollControls from './ScrollControls';
import AuthModal from './AuthModal';

const MainLayout = () => {
    const location = useLocation();

    return (
        <div className="app">
            <Navbar />
            <main>
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </main>
            <ScrollControls />
            <Footer />
            <AuthModal />
        </div>
    );
};

export default MainLayout;
