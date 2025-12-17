import React, { useState } from 'react';
import { Gift, Zap, Calendar, Copy, Check } from 'lucide-react';
import './Offers.css';

const Offers = () => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    const offers = [
        {
            id: 1,
            title: "Christmas Special",
            description: "Get 25% OFF on all movie tickets this Christmas week! Watch your favorite holiday movies with family.",
            code: "XMAS25",
            validity: "Valid till 25th Dec",
            image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600",
            color: "#ef4444"
        },
        {
            id: 2,
            title: "New Year Bash",
            description: "Welcome 2026 with a bang! Flat ₹100 OFF on booking 2 or more tickets.",
            code: "WELCOME2026",
            validity: "Valid 31st Dec - 2nd Jan",
            image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=600",
            color: "#8b5cf6"
        },
        {
            id: 3,
            title: "Winter Weekend",
            description: "Warm up your weekends with blockbuster movies. Buy 1 Get 1 Free on morning shows.",
            code: "WINTERSUN",
            validity: "Sat-Sun Morning Shows",
            image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600",
            color: "#f59e0b"
        }
    ];

    const copyCode = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="offers-page">
            <div className="container">
                <div className="offers-header">
                    <h1 className="offers-title">🎉 Festive Offers</h1>
                    <p className="offers-subtitle">Celebrate the season with blockbusters and savings!</p>
                </div>

                <div className="offers-grid">
                    {offers.map((offer, index) => (
                        <div key={offer.id} className="offer-card">
                            <div className="offer-image-wrapper">
                                <img src={offer.image} alt={offer.title} className="offer-image" />
                                <div className="offer-tag">
                                    <Gift size={14} style={{ marginRight: '4px' }} />
                                    Limited Time
                                </div>
                            </div>
                            <div className="offer-content">
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: offer.color }}>{offer.title}</h3>
                                <p style={{ color: '#9ca3af', marginBottom: '1rem', lineHeight: '1.5' }}>{offer.description}</p>

                                <div className="offer-code-container">
                                    <span className="offer-code">{offer.code}</span>
                                    <button onClick={() => copyCode(offer.code, index)} className="copy-btn">
                                        {copiedIndex === index ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e' }}><Check size={16} /> Copied</span> : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Copy size={16} /> Copy Code</span>}
                                    </button>
                                </div>

                                <div className="terms">
                                    <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                                    {offer.validity}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Offers;
