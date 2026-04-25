import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#121217',
                    color: '#fff',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h2 style={{ color: '#e50914' }}>Oops! Something went wrong.</h2>
                    <p>The application encountered an unexpected error.</p>
                    <button 
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }}
                        style={{
                            padding: '10px 20px',
                            background: '#e50914',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Clear Cache & Restart
                    </button>
                    {this.state.error && (
                        <pre style={{ 
                            marginTop: '2rem', 
                            fontSize: '0.8rem', 
                            color: '#666',
                            textAlign: 'left',
                            maxWidth: '80%',
                            overflow: 'auto',
                            padding: '1rem',
                            background: '#1a1a21'
                        }}>
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
