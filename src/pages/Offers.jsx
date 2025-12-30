import React, { useState } from 'react';
import { Gift, Zap, Calendar, Copy, Check, Sparkles } from 'lucide-react';
import './Offers.css';

const Offers = () => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('/api/offers');
                if (res.ok) {
                    const data = await res.json();
                    setOffers(data);
                }
            } catch (error) {
                console.error("Failed to fetch offers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const copyCode = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="offers-page">
            <div className="container">
                <div className="offers-header">
                    <h1 className="offers-title">
                        <Sparkles style={{ marginRight: '10px', color: '#ffd700' }} />
                        Seasonal Specials
                    </h1>
                    <p className="offers-subtitle">Exclusive deals for your Happy New Year celebrations!</p>
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
                                        {copiedIndex === index ?
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e' }}>
                                                <Check size={16} /> Copied
                                            </span> :
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Copy size={16} /> Copy Code
                                            </span>
                                        }
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
