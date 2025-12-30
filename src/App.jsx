import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cinemas from './pages/Cinemas';
import ComingSoon from './pages/ComingSoon';
import Profile from './pages/Profile';
import BookingSuccess from './pages/BookingSuccess';
import Offers from './pages/Offers';
import Loader from './components/Loader';

import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminTheaters from './pages/admin/AdminTheaters';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import AdminBookings from './pages/admin/AdminBookings';
import AdminOffers from './pages/admin/AdminOffers';

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Public/Auth Routes (No Navbar/Footer) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected/Main App Routes (With Navbar/Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/booking-success/:id" element={<BookingSuccess />} />
        <Route path="/cinemas" element={<Cinemas />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/loading" element={<Loader />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="theaters" element={<AdminTheaters />} />
          <Route path="showtimes" element={<AdminShowtimes />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="offers" element={<AdminOffers />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
