import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock fetch
global.fetch = vi.fn();

describe('App Integration', () => {
    it('redirects to login when not authenticated', async () => {
        render(<App />);
        // Should show Login page
        expect(screen.getByText(/Login/i, { selector: 'h2' })).toBeInTheDocument();
        expect(screen.queryByText('ShopSmart CRUD App')).not.toBeInTheDocument();
    });
});
