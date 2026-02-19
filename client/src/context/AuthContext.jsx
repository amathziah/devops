import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // In a real app, you might validate the token with the backend here
            // For now, we'll just decoding it or assuming it's valid if present
            // But to be safe, let's just set a dummy user or decode if we had a library
            // For simplicity, we'll just set the user as 'authenticated'
            setUser({ token });
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5001/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5001/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, token }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
