import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const success = await signup(email, password);
        setIsLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError('Could not create account. Email may already be in use.');
        }
    };

    return (
        <div className="auth-page">
            {isLoading && <LoadingSpinner />}

            {/* Left: Hero */}
            <div className="auth-hero">
                <div className="auth-hero-grid" />
                <div className="auth-hero-content">
                    <div className="auth-hero-logo">ShopSmart</div>
                    <p className="auth-hero-tagline">
                        Join thousands of teams that trust ShopSmart for their asset management needs.
                    </p>
                    <ul className="auth-hero-features">
                        <li>Instant setup, no credit card</li>
                        <li>Full-stack DevOps pipeline</li>
                        <li>Containerized deployment</li>
                        <li>Production-grade security</li>
                    </ul>
                </div>
            </div>

            {/* Right: Form */}
            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <h2>Create Account</h2>
                        <p>Get started with ShopSmart for free</p>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="signup-email">Email Address</label>
                            <input
                                id="signup-email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-password">Password</label>
                            <input
                                id="signup-password"
                                type="password"
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Create Free Account →
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?{' '}
                        <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
