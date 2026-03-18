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
        <div className="card">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="item-name">Name:</label>
                    <input
                        id="item-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Item name..."
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
                        placeholder="Optional description..."
                    />
                </div>
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
};

export default ItemForm;
