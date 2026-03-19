import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';
import { AuthProvider } from '../context/AuthContext';
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

const MockSignup = () => (
    <MemoryRouter>
        <AuthProvider>
            <Signup />
        </AuthProvider>
    </MemoryRouter>
);

describe('Signup Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders signup form', () => {
        render(<MockSignup />);
        expect(screen.getByText(/Create Account/i, { selector: 'h2' })).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Free Account/i })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<MockSignup />);
        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'securepass123' } });

        expect(emailInput.value).toBe('new@example.com');
        expect(passwordInput.value).toBe('securepass123');
    });

    it('submits form successfully', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'fake-token', user: { id: '2', email: 'new@example.com' } }),
        });

        render(<MockSignup />);
        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Create Free Account/i });

        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'securepass123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5001/auth/signup', expect.any(Object));
        });
    });

    it('displays error sign up fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Could not create account' }),
        });

        render(<MockSignup />);
        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Create Free Account/i });

        fireEvent.change(emailInput, { target: { value: 'fail@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'short' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Could not create account/i)).toBeInTheDocument();
        });
    });
});
