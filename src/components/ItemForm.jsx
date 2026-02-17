import { useState } from 'react';

const CATEGORIES = ["Food", "Drinks", "Cleaning", "Personal Care", "Other"];

export default function ItemForm({ onAdd }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Food');
    const [aisle, setAisle] = useState('');
    const [addedFeedback, setAddedFeedback] = useState(null); // show brief feedback

    const handleSubmit = (e, addToList = false) => {
        e.preventDefault();
        if (!name.trim()) return;

        onAdd({
            id: crypto.randomUUID(),
            name: name.trim(),
            category,
            aisle: aisle.trim() || 'Unassigned',
            status: addToList ? 'needed' : 'not_needed'
        });

        setAddedFeedback(addToList ? 'Added & marked needed!' : 'Saved to database!');
        setTimeout(() => setAddedFeedback(null), 1500);

        setName('');
        setAisle('');
    };

    return (
        <form onSubmit={(e) => handleSubmit(e, false)} className="card">
            <h3>Add New Item</h3>
            <input
                type="text"
                placeholder="Item name (e.g. Milk)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <div style={{ display: 'flex', gap: '10px' }}>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1 }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                    type="text"
                    placeholder="Aisle (e.g. 12)"
                    value={aisle}
                    onChange={(e) => setAisle(e.target.value)}
                    style={{ flex: 1 }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Add to Database
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={(e) => handleSubmit(e, true)}
                >
                    Add & Need
                </button>
            </div>

            {addedFeedback && (
                <div className="fade-in" style={{
                    marginTop: '10px',
                    textAlign: 'center',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                }}>
                    ✓ {addedFeedback}
                </div>
            )}
        </form>
    );
}
