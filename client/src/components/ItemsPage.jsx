import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ItemForm from './ItemForm';
import Item from './Item';
import LoadingSpinner from './LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function ItemsPage() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checkoutStatus, setCheckoutStatus] = useState(null);
    const { token, logout } = useAuth();

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/items`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = async (itemData) => {
        try {
            const response = await fetch(`${API_URL}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(itemData),
            });

            if (response.ok) fetchItems();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleUpdateItem = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) fetchItems();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await fetch(`${API_URL}/items/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleCheckout = () => {
        setCheckoutStatus('Processing...');
        setTimeout(() => {
            setCheckoutStatus('Success');
            setItems([]);
        }, 1500);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const recentCount = items.filter(i => {
        const created = new Date(i.createdAt);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return created > dayAgo;
    }).length;

    return (
        <div className="dashboard">
            {/* Navigation */}
            <nav className="top-nav">
                <div className="nav-brand">
                    <span className="nav-logo">ShopSmart</span>
                    <span className="nav-badge">Pro</span>
                </div>
                <div className="nav-actions">
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                {/* Header */}
                <div className="dashboard-header">
                    <h1>ShopSmart CRUD App</h1>
                    <p>Manage your inventory with ease</p>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">📦</span>
                        <div className="stat-value">{items.length}</div>
                        <div className="stat-label">Total Items</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🕐</span>
                        <div className="stat-value">{recentCount}</div>
                        <div className="stat-label">Added Today</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">✅</span>
                        <div className="stat-value">{items.length > 0 ? 'Active' : 'Empty'}</div>
                        <div className="stat-label">Status</div>
                    </div>
                </div>

                {/* Add Item Form */}
                <ItemForm onAdd={handleAddItem} />

                {/* Inventory */}
                <div className="inventory-section">
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Inventory</h2>
                                <span className="card-header-sub">{items.length} items total</span>
                            </div>
                            {items.length > 0 && (
                                <button id="checkout-btn" className="checkout-btn-main" onClick={handleCheckout}>
                                    🛒 Checkout
                                </button>
                            )}
                        </div>

                        {/* Checkout Status */}
                        {checkoutStatus === 'Processing...' && (
                            <div id="checkout-message">Processing...</div>
                        )}

                        {/* Checkout Success Modal */}
                        {checkoutStatus === 'Success' && (
                            <div className="checkout-overlay" onClick={() => setCheckoutStatus(null)}>
                                <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="checkmark-circle">
                                        <div className="checkmark" />
                                    </div>
                                    <div id="checkout-message">
                                        <h2>Success! Order Confirmed!</h2>
                                        <p>
                                            Your items have been successfully purchased and are on the way.
                                            Thank you for choosing ShopSmart!
                                        </p>
                                    </div>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setCheckoutStatus(null)}
                                    >
                                        Back to Inventory
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : items.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-state-icon">📭</span>
                                <p>No items found</p>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    Start adding some using the form above!
                                </p>
                            </div>
                        ) : (
                            <ul className="items-grid">
                                {items.map((item, i) => (
                                    <Item
                                        key={item.id}
                                        item={item}
                                        index={i}
                                        onUpdate={handleUpdateItem}
                                        onDelete={handleDeleteItem}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemsPage;
