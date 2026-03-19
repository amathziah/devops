import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const success = await login(email, password);
        setIsLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid credentials. Please try again.');
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
                        Your premium inventory management platform. Track, manage, and optimize your assets effortlessly.
                    </p>
                    <ul className="auth-hero-features">
                        <li>Real-time inventory tracking</li>
                        <li>Secure JWT authentication</li>
                        <li>Full CRUD operations</li>
                        <li>One-click checkout flow</li>
                    </ul>
                </div>
            </div>

            {/* Right: Form */}
            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to manage your inventory</p>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Sign In →
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
