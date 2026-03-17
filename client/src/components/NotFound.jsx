import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h1 style={{ fontSize: '6rem', marginBottom: '0' }}>404</h1>
            <h2>Oops! Page Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/">
                <button>Back to Home</button>
            </Link>
        </div>
    );
};

export default NotFound;
