import { useState } from 'react';

const ITEM_ICONS = ['📦', '🔧', '💎', '🎯', '⚡', '🔬', '🛡️', '📡'];

const Item = ({ item, index, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);
    const [editDescription, setEditDescription] = useState(item.description || '');

    const icon = ITEM_ICONS[(index || 0) % ITEM_ICONS.length];

    const handleUpdate = () => {
        onUpdate(item.id, { name: editName, description: editDescription });
        setIsEditing(false);
    };

    return (
        <li className="item-card" style={{ animationDelay: `${(index || 0) * 0.05}s` }}>
            {isEditing ? (
                <div className="edit-form">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Item name"
                        required
                    />
                    <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <div className="item-actions">
                        <button className="btn-primary" onClick={handleUpdate}>Save</button>
                        <button className="btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="item-card-header">
                        <div className="item-icon">{icon}</div>
                        <span className="item-status">Active</span>
                    </div>
                    <div className="item-body">
                        <h3>{item.name}</h3>
                        {item.description && <p>{item.description}</p>}
                        <span className="item-meta">
                            Created: {new Date(item.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <div className="item-actions">
                        <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="btn-danger" onClick={() => onDelete(item.id)}>Delete</button>
                    </div>
                </>
            )}
        </li>
    );
};

export default Item;
