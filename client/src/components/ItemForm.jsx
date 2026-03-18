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
        <div className="card" style={{ background: 'linear-gradient(to bottom right, var(--card-bg), hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.05))' }}>
            <h2>Create New Asset</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add a new item to your decentralized inventory tracking system.</p>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label htmlFor="item-name">Asset Name</label>
                        <input
                            id="item-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Server Rack A1"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="item-desc">Reference / Desc</label>
                        <input
                            id="item-desc"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Primary cluster"
                        />
                    </div>
                </div>
                <button type="submit" className="primary-btn" style={{ width: '100%' }}>
                    ✨ Deploy Item to Inventory
                </button>
            </form>
        </div>
    );
};

export default ItemForm;
