import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

const MockLogin = () => (
    <MemoryRouter>
        <AuthProvider>
            <Login />
        </AuthProvider>
    </MemoryRouter>
);

describe('Login Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders login form', () => {
        render(<MockLogin />);
        expect(screen.getByText(/Welcome Back/i, { selector: 'h2' })).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<MockLogin />);
        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('submits form with credentials', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'fake-token', user: { id: '1', email: 'test@example.com' } }),
        });

        render(<MockLogin />);
        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Sign In/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5001/auth/login', expect.any(Object));
        });
    });

    it('displays error on failed login', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid credentials' }),
        });

        render(<MockLogin />);
        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Sign In/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
    });
});
