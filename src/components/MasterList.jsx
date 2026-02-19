import { useState } from 'react';

export default function MasterList({ items, onUpdate, onDelete }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleListStatus = (item) => {
        onUpdate({
            ...item,
            status: (item.status === 'needed' || item.status === 'in_cart') ? 'not_needed' : 'needed'
        });
    };

    return (
        <div className="master-list">
            <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '1rem', width: '100%', padding: '8px' }}
            />

            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Aisle</th>
                        <th>Category</th>
                        <th>Price (OMR)</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map(item => {
                        const isOnList = item.status === 'needed' || item.status === 'in_cart';
                        return (
                            <tr key={item.id}>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                                    {item.is_essential && <span style={{ fontSize: '0.7rem', color: 'gold' }}>★ Essential</span>}
                                </td>
                                <td>{item.aisle || '-'}</td>
                                <td>{item.category}</td>
                                <td>{item.price ? item.price.toFixed(3) : '-'}</td>
                                <td>
                                    <button
                                        onClick={() => toggleListStatus(item)}
                                        className={isOnList ? 'btn-green' : 'btn-outline'}
                                        style={{ fontSize: '0.8rem', padding: '2px 8px' }}
                                    >
                                        {isOnList ? 'On List' : 'Add'}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item.id);
                                        }}
                                        className="btn-danger"
                                        style={{ padding: '2px 5px' }}
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
