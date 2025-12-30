import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
    en: {
        translation: {
            "nav": {
                "home": "Home",
                "movies": "Movies",
                "cinemas": "Cinemas",
                "offers": "Offers",
                "signin": "Sign In",
                "myaccount": "My Account",
                "search_placeholder": "Search movies..."
            },
            "home": {
                "hollywood": "Hollywood Blockbusters",
                "bollywood": "Bollywood Hits",
                "tollywood": "Tollywood & South Indian Cinema",
                "recommended": "Recommended For You",
                "recommended_sub": "Based on your watching history",
                "watch_trailer": "Watch Trailer",
                "book_tickets": "Book Tickets",
                "now_showing": "Now Showing"
            }
        }
    },
    hi: {
        translation: {
            "nav": {
                "home": "होम",
                "movies": "फिल्में",
                "cinemas": "सिनेमाघर",
                "offers": "ऑफ़र",
                "signin": "साइन इन",
                "myaccount": "मेरा खाता",
                "search_placeholder": "फिल्में खोजें..."
            },
            "home": {
                "hollywood": "हॉलीवुड ब्लॉकबस्टर्स",
                "bollywood": "बॉलीवुड हिट्स",
                "tollywood": "टॉलीवुड और दक्षिण भारतीय सिनेमा",
                "recommended": "आपके लिए अनुशंसित",
                "recommended_sub": "आपके देखने के इतिहास पर आधारित",
                "watch_trailer": "ट्रेलर देखें",
                "book_tickets": "टिकट बुक करें",
                "now_showing": "अभी चल रहा है"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
