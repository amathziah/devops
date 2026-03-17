import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function ItemsPage() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [checkoutStatus, setCheckoutStatus] = useState(null);
    const { token, logout } = useAuth();

    const API_URL = 'http://localhost:5001';

    const handleCheckout = () => {
        setCheckoutStatus('Processing...');
        setTimeout(() => {
            setCheckoutStatus('Success! Your items have been purchased.');
            setItems([]); // Clear cart (simulation)
        }, 1500);
    };

    // Fetch all items
    const fetchItems = async () => {
        try {
            const response = await fetch(`${API_URL}/items`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    // Add a new item
    const addItem = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const response = await fetch(`${API_URL}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description }),
            });

            if (response.ok) {
                setName('');
                setDescription('');
                fetchItems();
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    // Update an item
    const updateItem = async (id) => {
        if (!editName.trim()) return;

        try {
            const response = await fetch(`${API_URL}/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: editName, description: editDescription }),
            });

            if (response.ok) {
                setEditingId(null);
                setEditName('');
                setEditDescription('');
                fetchItems();
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    // Delete an item
    const deleteItem = async (id) => {
        try {
            const response = await fetch(`${API_URL}/items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchItems();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Start editing an item
    const startEdit = (item) => {
        setEditingId(item.id);
        setEditName(item.name);
        setEditDescription(item.description || '');
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditDescription('');
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>ShopSmart CRUD App</h1>
                <button onClick={logout} style={{ backgroundColor: '#ff4444' }}>Logout</button>
            </header>

            {/* Add Item Form */}
            <div className="card">
                <h2>Add New Item</h2>
                <form onSubmit={addItem}>
                    <div>
                        <label htmlFor="item-name">Name:</label>
                        <input
                            id="item-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="item-desc">Description:</label>
                        <input
                            id="item-desc"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit">Add Item</button>
                </form>
            </div>

            {/* Items List */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Items ({items.length})</h2>
                    {items.length > 0 && (
                        <button 
                            id="checkout-btn" 
                            onClick={handleCheckout} 
                            style={{ backgroundColor: '#4CAF50' }}
                        >
                            Checkout
                        </button>
                    )}
                </div>

                {checkoutStatus && (
                    <div id="checkout-message" className="card" style={{ backgroundColor: '#e8f5e9', border: '1px solid #4CAF50' }}>
                        <p>{checkoutStatus}</p>
                    </div>
                )}

                {items.length === 0 ? (
                    <p>No items found. Add some items above!</p>
                ) : (
                    <ul className="items-list">
                        {items.map((item) => (
                            <li key={item.id} className="item">
                                {editingId === item.id ? (
                                    <div className="edit-form">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                        <button onClick={() => updateItem(item.id)}>Save</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </div>
                                ) : (
                                    <div className="item-content">
                                        <div>
                                            <strong>{item.name}</strong>
                                            {item.description && <p>{item.description}</p>}
                                            <small>Created: {new Date(item.createdAt).toLocaleString()}</small>
                                        </div>
                                        <div className="actions">
                                            <button onClick={() => startEdit(item)}>Edit</button>
                                            <button onClick={() => deleteItem(item.id)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ItemsPage;
