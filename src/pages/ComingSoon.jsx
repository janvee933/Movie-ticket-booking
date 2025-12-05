import React from 'react';
import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

const ComingSoon = ({ title }) => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: '80px',
            color: 'var(--color-text-muted)'
        }}>
            <Construction size={64} style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
            <h1 style={{
                fontSize: '3rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-main)',
                marginBottom: '1rem'
            }}>
                {title || 'Coming Soon'}
            </h1>
            <p style={{ maxWidth: '400px', marginBottom: '2rem' }}>
                We are working hard to bring you this feature. Stay tuned for updates!
            </p>
            <Link to="/" className="btn btn-primary">
                Back to Home
            </Link>
        </div>
    );
};

export default ComingSoon;
