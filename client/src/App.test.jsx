import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        expect(screen.getByText('ShopSmart CRUD App')).toBeInTheDocument();
    });

    it('renders add item form', () => {
        render(<App />);
        expect(screen.getByText('Add New Item')).toBeInTheDocument();
        expect(screen.getAllByRole('textbox')).toHaveLength(2);
        expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
    });

    it('renders items list section', () => {
        render(<App />);
        expect(screen.getByText('Items (0)')).toBeInTheDocument();
    });
});
