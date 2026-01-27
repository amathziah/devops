import { useState, useEffect } from 'react'

function App() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const API_URL = 'http://localhost:5001';

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
            <h1>ShopSmart CRUD App</h1>
            
            {/* Add Item Form */}
            <div className="card">
                <h2>Add New Item</h2>
                <form onSubmit={addItem}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
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
                <h2>Items ({items.length})</h2>
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

export default App;
