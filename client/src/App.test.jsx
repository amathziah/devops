import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch
global.fetch = vi.fn();

describe('App Integration', () => {
    it('redirects to login when not authenticated', async () => {
        // App.jsx likely has its own Router
        render(<App />);
        // Should show Login page
        await waitFor(() => {
            expect(screen.getByText(/Login/i, { selector: 'h2' })).toBeInTheDocument();
        });
    });
});
