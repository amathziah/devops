import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component to consume the hook
const TestComponent = () => {
    const { user, login, signup, logout, loading, token } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <div data-testid="user">{user ? (user.email || 'authenticated') : 'null'}</div>
            <div data-testid="token">{token ? 'present' : 'null'}</div>
            <button onClick={() => login('test@example.com', 'password')}>Login</button>
            <button onClick={() => signup('new@example.com', 'password')}>Signup</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch = vi.fn();
    });

    it('initializes with null user and token', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('user').textContent).toBe('null');
        expect(screen.getByTestId('token').textContent).toBe('null');
    });

    it('recovers session from localStorage', async () => {
        localStorage.setItem('token', 'fake-token');
        
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('user').textContent).toBe('authenticated');
        expect(screen.getByTestId('token').textContent).toBe('present');
    });

    it('handles successful login', async () => {
        const mockUser = { email: 'test@example.com' };
        const mockToken = 'new-token';
        
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser, token: mockToken }),
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => screen.getByText('Login'));
        screen.getByText('Login').click();

        await waitFor(() => {
            expect(screen.getByTestId('user').textContent).toBe('test@example.com');
            expect(screen.getByTestId('token').textContent).toBe('present');
            expect(localStorage.getItem('token')).toBe(mockToken);
        });
    });

    it('handles unsuccessful login', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid credentials' }),
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => screen.getByText('Login'));
        screen.getByText('Login').click();

        await waitFor(() => {
            expect(screen.getByTestId('user').textContent).toBe('null');
        });
    });

    it('handles logout', async () => {
        localStorage.setItem('token', 'fake-token');
        
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => screen.getByText('Logout'));
        screen.getByText('Logout').click();

        await waitFor(() => {
            expect(screen.getByTestId('user').textContent).toBe('null');
            expect(screen.getByTestId('token').textContent).toBe('null');
            expect(localStorage.getItem('token')).toBeNull();
        });
    });
});
