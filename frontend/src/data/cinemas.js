import { movies } from './movies';

export const cinemas = [
    {
        id: 1,
        name: "PVR Cinemas: Phoenix Marketcity",
        location: "Velachery, Chennai",
        image: "https://images.unsplash.com/photo-1517604931442-7105366a2e1c?auto=format&fit=crop&w=800&q=80",
        movies: [movies[0], movies[8], movies[11], movies[14]] // Inception, Jawan, RRR, Animal
    },
    {
        id: 2,
        name: "INOX: VR Mall",
        location: "Anna Nagar, Chennai",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
        movies: [movies[1], movies[9], movies[12], movies[15]] // Interstellar, 3 Idiots, Baahubali 2, Tiger 3
    },
    {
        id: 3,
        name: "SPI Cinemas: Palazzo",
        location: "Vadapalani, Chennai",
        image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=800&q=80",
        movies: [movies[2], movies[10], movies[13], movies[16]] // Dark Knight, Dangal, Pushpa, Dunki
    },
    {
        id: 4,
        name: "Cinepolis: Nexus Mall",
        location: "Koramangala, Bangalore",
        image: "https://images.unsplash.com/photo-1517604931442-7105366a2e1c?auto=format&fit=crop&w=800&q=80",
        movies: [movies[3], movies[17], movies[18], movies[19]] // Dune 2, Ek Tha Tiger, Om Shanti Om, Vivah
    }
];
