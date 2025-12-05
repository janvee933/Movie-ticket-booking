import React from 'react';
import { X } from 'lucide-react';
import './TrailerModal.css';

const TrailerModal = ({ isOpen, onClose, trailerUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
                <div className="video-container">
                    <iframe
                        src={`${trailerUrl}?autoplay=1`}
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
