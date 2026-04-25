import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './ScrollControls.css';

const ScrollControls = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className="scroll-controls">
            <button
                onClick={scrollToTop}
                className={`scroll-btn scroll-top ${isVisible ? 'visible' : ''}`}
                aria-label="Scroll to top"
            >
                <ArrowUp size={24} />
            </button>
            <button
                onClick={scrollToBottom}
                className="scroll-btn scroll-bottom"
                aria-label="Scroll to bottom"
            >
                <ArrowDown size={24} />
            </button>
        </div>
    );
};

export default ScrollControls;
