import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-code">404</div>
            <h2>Page Not Found</h2>
            <p>
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>
            <Link to="/">
                <button className="btn-primary">← Back to Home</button>
            </Link>
        </div>
    );
};

export default NotFound;
