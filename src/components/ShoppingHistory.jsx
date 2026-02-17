import { useState } from 'react';

export default function ShoppingHistory({ history, onClearHistory }) {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (history.length === 0) {
        return (
            <div style={{ textAlign: 'center', color: 'var(--color-subtext)', padding: '2rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕐</div>
                <p style={{ margin: 0 }}>No shopping history yet.</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                    Complete a shopping trip and it will appear here!
                </p>
            </div>
        );
    }

    return (
        <div className="shopping-history">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-subtext)' }}>
                    {history.length} trip{history.length !== 1 ? 's' : ''} recorded
                </div>
                <button
                    className="btn-danger"
                    style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                    onClick={() => {
                        if (window.confirm('Clear all shopping history? This cannot be undone.')) {
                            onClearHistory();
                        }
                    }}
                >
                    Clear All
                </button>
            </div>

            <div className="history-timeline">
                {history.map((trip) => {
                    const isExpanded = expandedId === trip.id;
                    return (
                        <div key={trip.id} className="history-card card" onClick={() => toggleExpand(trip.id)}>
                            <div className="history-card-header">
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                                        {formatDate(trip.date)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-subtext)' }}>
                                        {formatTime(trip.date)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                            {trip.purchased.length} item{trip.purchased.length !== 1 ? 's' : ''}
                                        </div>
                                        {trip.missed.length > 0 && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>
                                                {trip.missed.length} missed
                                            </div>
                                        )}
                                    </div>
                                    <span style={{
                                        transition: 'transform 0.2s',
                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                                        fontSize: '0.8rem',
                                        color: 'var(--color-subtext)'
                                    }}>
                                        ▼
                                    </span>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="history-card-details fade-in" onClick={(e) => e.stopPropagation()}>
                                    {trip.purchased.length > 0 && (
                                        <div style={{ marginTop: '12px' }}>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                color: 'var(--color-primary)',
                                                marginBottom: '6px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                ✓ Purchased
                                            </div>
                                            <div className="history-chips">
                                                {trip.purchased.map((item, i) => (
                                                    <span key={i} className="history-chip purchased">
                                                        {item.name}
                                                        <span className="chip-aisle">A{item.aisle}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {trip.missed.length > 0 && (
                                        <div style={{ marginTop: '10px' }}>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                color: 'var(--color-danger)',
                                                marginBottom: '6px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                ✗ Missed
                                            </div>
                                            <div className="history-chips">
                                                {trip.missed.map((item, i) => (
                                                    <span key={i} className="history-chip missed">
                                                        {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
