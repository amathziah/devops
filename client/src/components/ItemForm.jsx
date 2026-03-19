import { useState } from 'react';

const ItemForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd({ name, description });
        setName('');
        setDescription('');
    };

    return (
        <div className="form-card">
            <h2>✨ Create New Item</h2>
            <p className="form-subtitle">Add a new asset to your inventory tracking system.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="item-name">Item Name</label>
                        <input
                            id="item-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. MacBook Pro M4"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="item-desc">Description</label>
                        <input
                            id="item-desc"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Dev team workstation"
                        />
                    </div>
                </div>
                <button type="submit" style={{ width: '100%' }}>
                    Add Item →
                </button>
            </form>
        </div>
    );
};

export default ItemForm;
