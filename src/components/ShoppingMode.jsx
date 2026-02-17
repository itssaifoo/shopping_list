import { useMemo } from 'react';
import { sortItems } from '../utils/sorting';

export default function ShoppingMode({ items, onUpdate, onFinish, onExit }) {
    // Only show items that are needed or in_cart
    const shoppingItems = useMemo(() => {
        const active = items.filter(i => i.status === 'needed' || i.status === 'in_cart');
        return sortItems(active);
    }, [items]);

    const toggleCart = (item) => {
        onUpdate({
            ...item,
            status: item.status === 'in_cart' ? 'needed' : 'in_cart'
        });
    };

    const progress = shoppingItems.length > 0
        ? shoppingItems.filter(i => i.status === 'in_cart').length / shoppingItems.length
        : 0;

    return (
        <div className="shopping-mode">
            <div style={{
                position: 'sticky',
                top: 0,
                background: 'var(--color-bg)',
                padding: '10px 0',
                zIndex: 10,
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <button onClick={onExit} className="btn-outline">← Back</button>
                <h2 style={{ margin: 0 }}>Shopping</h2>
                <button onClick={onFinish} className="btn-primary">Finish</button>
            </div>

            <div style={{ height: '4px', background: '#ddd', borderRadius: '2px', marginBottom: '20px' }}>
                <div style={{
                    height: '100%',
                    width: `${progress * 100}%`,
                    background: 'var(--color-primary)',
                    borderRadius: '2px',
                    transition: 'width 0.3s'
                }} />
            </div>

            {shoppingItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>No items marked as needed!</p>
                    <button onClick={onExit} className="btn-primary">Go Add Items</button>
                </div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {shoppingItems.map(item => (
                        <li
                            key={item.id}
                            onClick={() => toggleCart(item)}
                            className="card"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px',
                                cursor: 'pointer',
                                opacity: item.status === 'in_cart' ? 0.5 : 1,
                                textDecoration: item.status === 'in_cart' ? 'line-through' : 'none',
                                background: item.status === 'in_cart' ? '#e9ecef' : 'white'
                            }}
                        >
                            <div>
                                <span style={{ fontWeight: 'bold', display: 'block' }}>{item.name}</span>
                                <span style={{ fontSize: '0.85em', color: 'var(--color-subtext)' }}>
                                    Aisle {item.aisle} • {item.category}
                                </span>
                            </div>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                border: '2px solid var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: item.status === 'in_cart' ? 'var(--color-primary)' : 'transparent'
                            }}>
                                {item.status === 'in_cart' && <span style={{ color: 'white', fontWeight: 'bold' }}>✓</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
