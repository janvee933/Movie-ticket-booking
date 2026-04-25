import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useBooking = () => {
    const navigate = useNavigate();
    const { isAuthenticated, openAuthModal } = useAuth();

    const handleBooking = (movieId) => {
        const bookingPath = `/booking/${movieId}`;

        if (isAuthenticated) {
            navigate(bookingPath);
        } else {
            // Open the auth choice modal instead of direct redirect
            openAuthModal(bookingPath);
        }
    };

    return { handleBooking };
};

export default useBooking;
