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
            setError('Failed to sign up');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '450px' }}>
            <div className="card" style={{ marginBottom: 0 }}>
                {isLoading && <LoadingSpinner />}
                <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Create Account</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Join ShopSmart and start managing</p>
                
                {error && <div style={{ 
                    padding: '0.75rem', 
                    background: 'hsla(0, 84%, 60%, 0.1)', 
                    color: 'var(--danger)', 
                    borderRadius: '8px', 
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
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
                    <div>
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
                    <button type="submit" style={{ marginTop: '1rem' }}>Create Free Account</button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
