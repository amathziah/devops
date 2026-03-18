import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ItemForm from './ItemForm';
import Item from './Item';
import LoadingSpinner from './LoadingSpinner';

const API_URL = 'http://localhost:5001';

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
            setItems([]); // Local simulate
        }, 1500);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="container">
            <div className="nav">
                <h1>ShopSmart</h1>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </div>

            <ItemForm onAdd={handleAddItem} />

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Inventory ({items.length})</h2>
                    {items.length > 0 && (
                        <button className="checkout-btn-main" onClick={handleCheckout}>
                            🛒 Checkout
                        </button>
                    )}
                </div>

                {checkoutStatus === 'Success' && (
                    <div className="checkout-overlay" onClick={() => setCheckoutStatus(null)}>
                        <div className="checkout-modal">
                            <div className="checkmark-circle">
                                <div className="checkmark"></div>
                            </div>
                            <h2>Order Confirmed!</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Your items have been successfully purchased and are on the way.
                                Thank you for choosing ShopSmart!
                            </p>
                            <button className="primary-btn" onClick={() => setCheckoutStatus(null)} style={{ width: '100%' }}>
                                Back to Inventory
                            </button>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <LoadingSpinner />
                ) : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        <p>No inventory items yet. Start adding some!</p>
                    </div>
                ) : (
                    <ul className="items-list">
                        {items.map((item) => (
                            <Item 
                                key={item.id} 
                                item={item} 
                                onUpdate={handleUpdateItem} 
                                onDelete={handleDeleteItem} 
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ItemsPage;
