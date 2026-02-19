import { useState } from 'react';

export default function ItemForm({ onAdd }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Food');
    const [aisle, setAisle] = useState('');
    const [price, setPrice] = useState('');
    const [isEssential, setIsEssential] = useState(false);
    const [addedFeedback, setAddedFeedback] = useState(null);

    const categories = ['Food', 'Drinks', 'Cleaning', 'Personal Care', 'Other'];

    const handleSubmit = (e, addToList = false) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newItem = {
            id: crypto.randomUUID(),
            name: name.trim(),
            category,
            aisle: aisle.trim() || 'Unassigned',
            price: parseFloat(price) || 0,
            quantity: 1, // Default to 1
            is_essential: Boolean(isEssential), // Force boolean
            status: addToList ? 'needed' : 'not_needed'
        };

        console.log('Adding item:', newItem); // Debug log
        onAdd(newItem);

        setAddedFeedback(addToList ? 'Added & marked needed!' : 'Saved to Inventory!');
        setTimeout(() => setAddedFeedback(null), 2000);

        setName('');
        setAisle('');
        setPrice('');
        setIsEssential(false);
    };

    return (
        <div className="card">
            <h3>Add New Item</h3>
            <form>
                <div style={{ marginBottom: '10px' }}>
                    <label>Item Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Milk"
                    />
                </div>

                <div className="grid-2">
                    <div>
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Aisle (Optional)</label>
                        <input
                            type="text"
                            value={aisle}
                            onChange={(e) => setAisle(e.target.value)}
                            placeholder="e.g. 5"
                        />
                    </div>
                </div>

                <div className="grid-2" style={{ marginTop: '10px' }}>
                    <div>
                        <label>Price (OMR) (Optional)</label>
                        <input
                            type="number"
                            step="0.001"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.000"
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isEssential}
                                onChange={(e) => setIsEssential(e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            Weekly Essential
                        </label>
                    </div>
                </div>

                <div className="action-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={(e) => handleSubmit(e, false)} className="btn-secondary" style={{ flex: 1 }}>
                        Save to DB
                    </button>
                    <button onClick={(e) => handleSubmit(e, true)} className="btn-primary" style={{ flex: 1 }}>
                        Add & Need
                    </button>
                </div>
                {addedFeedback && <p className="fade-in" style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{addedFeedback}</p>}
            </form>
        </div>
    );
}
