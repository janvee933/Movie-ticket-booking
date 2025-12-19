import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

import ScrollControls from './ScrollControls';

const MainLayout = () => {
    return (
        <div className="app">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <ScrollControls />
            <Footer />
        </div>
    );
};

export default MainLayout;
