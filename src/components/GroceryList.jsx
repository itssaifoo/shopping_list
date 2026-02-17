import { useState } from 'react';

export default function GroceryList({ items, onUpdate, onDelete }) {
    // Group by category for easier management
    const grouped = items.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {});

    const toggleStatus = (item) => {
        onUpdate({
            ...item,
            status: item.status === 'needed' ? 'not_needed' : 'needed',
            // Reset in_cart if it was somehow there, though this view shows all
        });
    };

    return (
        <div className="grocery-list">
            {Object.entries(grouped).map(([category, categoryItems]) => (
                <div key={category} className="card" style={{ padding: '1rem' }}>
                    <h4 style={{ marginTop: 0 }}>{category}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {categoryItems.map(item => (
                            <li key={item.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--color-border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={item.status === 'needed' || item.status === 'in_cart'} // If it's needed or in cart, it's "Active"
                                        onChange={() => toggleStatus(item)}
                                        style={{ width: '20px', height: '20px', margin: 0 }}
                                    />
                                    <span>{item.name}</span>
                                    <span style={{ fontSize: '0.8em', color: 'var(--color-subtext)' }}>
                                        {item.aisle ? `(Aisle ${item.aisle})` : ''}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="btn-danger"
                                    style={{ padding: '4px 8px' }}
                                    aria-label="Delete"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            {items.length === 0 && <p style={{ textAlign: 'center', color: 'var(--color-subtext)' }}>No items yet. Add some above!</p>}
        </div>
    );
}
