import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ItemsPage from './ItemsPage';
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

// Mock Auth Context to avoid real login logic in unit test, 
// OR just wrap in AuthProvider and mock the fetch call for login?
// Better to mock the module or provide a custom AuthContext.
// But ItemsPage uses useAuth() to get token.
// Let's just mock the useAuth hook if possible, or Mock the localStorage/fetch logic in AuthProvider.
// Actually, for ItemsPage, we can just wrap it in a context that provides a token.

// We need to mock useAuth from '../context/AuthContext'
// But since we are inside the test, maybe we can just create a helper component
// that sets the context value.
// However, AuthProvider implementation is strict.
// Let's just mock the module.

vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            token: 'test-token',
            logout: vi.fn(),
            user: { id: '1', email: 'test@example.com' }
        }),
    };
});

describe('ItemsPage Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        // Default mock for fetch items
        fetch.mockResolvedValue({
            ok: true,
            json: async () => [],
        });
    });

    it('renders Add New Item form', async () => {
        render(
            <MemoryRouter>
                <ItemsPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Add New Item')).toBeInTheDocument();
    });

    it('fetches items on mount', async () => {
        const mockItems = [{ id: '1', name: 'Item 1', description: 'Desc 1', createdAt: new Date().toISOString() }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockItems,
        });

        render(
            <MemoryRouter>
                <ItemsPage />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });
        expect(fetch).toHaveBeenCalledWith('http://localhost:5001/items');
    });

    it('adds a new item', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => [] }); // initial load
        render(
            <MemoryRouter>
                <ItemsPage />
            </MemoryRouter>
        );

        const nameInput = screen.getByLabelText(/Name:/i);
        const descInput = screen.getByLabelText(/Description:/i);
        const addButton = screen.getByRole('button', { name: /Add Item/i });

        fireEvent.change(nameInput, { target: { value: 'New Item' } });
        fireEvent.change(descInput, { target: { value: 'New Desc' } });

        // Mock the POST request
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: '2', name: 'New Item' }),
        });
        // Mock the refresh fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: '2', name: 'New Item', createdAt: new Date().toISOString() }],
        });

        fireEvent.click(addButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5001/items', expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer test-token'
                })
            }));
        });
    });

    it('handles checkout sequence', async () => {
        const mockItems = [{ id: '1', name: 'Item 1', description: 'Desc 1', createdAt: new Date().toISOString() }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockItems,
        });

        render(
            <MemoryRouter>
                <ItemsPage />
            </MemoryRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        const checkoutBtn = screen.getByRole('button', { name: /Checkout/i });
        fireEvent.click(checkoutBtn);

        // Check for modal presence
        await waitFor(() => {
            expect(screen.getByText(/Order Confirmed!/i)).toBeInTheDocument();
        }, { timeout: 2000 });

        expect(screen.getByText(/No inventory items yet/i)).toBeInTheDocument();
    });
});
