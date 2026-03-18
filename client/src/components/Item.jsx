import { useState } from 'react';

const Item = ({ item, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);
    const [editDescription, setEditDescription] = useState(item.description || '');

    const handleUpdate = () => {
        onUpdate(item.id, { name: editName, description: editDescription });
        setIsEditing(false);
    };

    return (
        <li className="item">
            {isEditing ? (
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
                    <div className="actions">
                        <button onClick={handleUpdate}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="item-content">
                    <div className="item-info">
                        <h3>{item.name}</h3>
                        {item.description && <p>{item.description}</p>}
                        <span className="item-meta">Created: {new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="actions">
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="btn-delete" onClick={() => onDelete(item.id)}>Delete</button>
                    </div>
                </div>
            )}
        </li>
    );
};

export default Item;
