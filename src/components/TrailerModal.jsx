import React from 'react';
import { X } from 'lucide-react';
import './TrailerModal.css';

const TrailerModal = ({ isOpen, onClose, trailerUrl }) => {
    if (!isOpen || !trailerUrl) return null;

    return (
        <div className="trailer-modal-overlay" onClick={onClose}>
            <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={onClose}>
                    <X size={24} />
                </button>
                <div className="video-wrapper">
                    <iframe
                        src={trailerUrl}
                        title="Movie Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default TrailerModal;
