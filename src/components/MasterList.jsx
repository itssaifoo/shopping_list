import { useState, useRef } from 'react';

export default function MasterList({ items, onUpdate, onDelete }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [pulsingId, setPulsingId] = useState(null);
    const pulseTimeout = useRef(null);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filteredItems.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {});

    const toggleListStatus = (item) => {
        // Pulse animation feedback
        if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
        setPulsingId(item.id);
        pulseTimeout.current = setTimeout(() => setPulsingId(null), 300);

        onUpdate({
            ...item,
            status: (item.status === 'needed' || item.status === 'in_cart') ? 'not_needed' : 'needed'
        });
    };

    return (
        <div className="master-list">
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>

            <div style={{
                fontSize: '0.85rem',
                color: 'var(--color-subtext)',
                marginBottom: '1rem',
                textAlign: 'center'
            }}>
                {items.length} item{items.length !== 1 ? 's' : ''} in database
                {searchTerm && ` · ${filteredItems.length} match${filteredItems.length !== 1 ? 'es' : ''}`}
            </div>

            {Object.entries(grouped).sort().map(([category, categoryItems]) => (
                <div key={category} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                    <h4 style={{ marginTop: 0, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>{category}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {categoryItems.map(item => {
                            const isOnList = item.status === 'needed' || item.status === 'in_cart';
                            return (
                                <li
                                    key={item.id}
                                    className={`db-item${isOnList ? ' on-list' : ''}`}
                                >
                                    <div
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, cursor: 'pointer' }}
                                        onClick={() => toggleListStatus(item)}
                                    >
                                        <button
                                            className={`db-item-check${pulsingId === item.id ? ' pulse' : ''}`}
                                            tabIndex={-1}
                                            aria-label={isOnList ? 'Remove from list' : 'Add to list'}
                                        >
                                            {isOnList ? '✓' : ''}
                                        </button>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.85em', color: 'var(--color-subtext)' }}>
                                                Aisle: {item.aisle || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="btn-danger"
                                        style={{ padding: '4px 8px', flexShrink: 0 }}
                                        aria-label="Delete"
                                    >
                                        ✕
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}

            {items.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--color-subtext)', padding: '2rem 0' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                    <p style={{ margin: 0 }}>No items in your database yet.</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                        Switch to the <strong>+</strong> tab to add your first item!
                    </p>
                </div>
            )}

            {items.length > 0 && filteredItems.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--color-subtext)' }}>
                    No items match "{searchTerm}"
                </p>
            )}
        </div>
    );
}
