import { useState, useEffect } from 'react';
import ItemForm from './components/ItemForm';
import GroceryList from './components/GroceryList';
import ShoppingMode from './components/ShoppingMode';
import MasterList from './components/MasterList';
import ShoppingHistory from './components/ShoppingHistory';
import { db } from './db';
import { useLiveQuery } from 'dexie-react-hooks';

function App() {
  const items = useLiveQuery(() => db.items.toArray()) || [];
  const history = useLiveQuery(() => db.history.orderBy('date').reverse().toArray()) || [];

  const [mode, setMode] = useState('manage'); // 'manage' | 'shopping'
  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'list' | 'add' | 'history'

  // Migration from localStorage
  useEffect(() => {
    const migrateData = async () => {
      const STORAGE_KEY = 'grocery-app-data';
      const HISTORY_KEY = 'grocery-app-history';

      const localItems = localStorage.getItem(STORAGE_KEY);
      const localHistory = localStorage.getItem(HISTORY_KEY);

      if (localItems) {
        try {
          const parsedItems = JSON.parse(localItems);
          if (Array.isArray(parsedItems) && parsedItems.length > 0) {
            await db.items.bulkPut(parsedItems);
            console.log('Migrated items from localStorage');
          }
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.error('Migration failed for items', e);
        }
      }

      if (localHistory) {
        try {
          const parsedHistory = JSON.parse(localHistory);
          if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
            await db.history.bulkPut(parsedHistory);
            console.log('Migrated history from localStorage');
          }
          localStorage.removeItem(HISTORY_KEY);
        } catch (e) {
          console.error('Migration failed for history', e);
        }
      }
    };

    migrateData();
  }, []);

  const addItem = async (item) => {
    await db.items.add(item);
  };

  const updateItem = async (updated) => {
    await db.items.put(updated);
  };

  const deleteItem = async (id) => {
    if (window.confirm('Delete this item permanently?')) {
      await db.items.delete(id);
    }
  };

  const startShopping = () => setMode('shopping');

  const finishShopping = async () => {
    if (window.confirm('Finish shopping? Checked items will be marked as not needed.')) {
      // Capture history snapshot BEFORE resetting statuses
      const purchased = items
        .filter(i => i.status === 'in_cart')
        .map(i => ({ name: i.name, category: i.category, aisle: i.aisle }));

      const missed = items
        .filter(i => i.status === 'needed')
        .map(i => ({ name: i.name, category: i.category, aisle: i.aisle }));

      if (purchased.length > 0 || missed.length > 0) {
        const trip = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          purchased,
          missed
        };
        await db.history.add(trip);
      }

      // Reset item statuses
      // We need to update multiple items, ideally in a transaction
      await db.transaction('rw', db.items, async () => {
        const inCartItems = await db.items.where('status').equals('in_cart').toArray();
        for (const item of inCartItems) {
          await db.items.update(item.id, { status: 'not_needed' });
        }
      });

      setMode('manage');
    }
  };

  const exitShopping = () => setMode('manage');

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      await db.history.clear();
    }
  };

  const neededCount = items.filter(i => i.status === 'needed' || i.status === 'in_cart').length;

  // Shopping mode takes over the full screen
  if (mode === 'shopping') {
    return (
      <div className="container">
        <ShoppingMode
          items={items}
          onUpdate={updateItem}
          onFinish={finishShopping}
          onExit={exitShopping}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.25rem', fontSize: '1.4rem' }}>
          Grocery Tracker
        </h1>
      </header>

      {/* Tab Content */}
      <div className="tab-content-area">
        {activeTab === 'database' && (
          <div className="tab-content fade-in">
            <MasterList items={items} onUpdate={updateItem} onDelete={deleteItem} />
          </div>
        )}

        {activeTab === 'list' && (
          <div className="tab-content fade-in">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '0 0 1rem 0'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Shopping List</h2>
              <button
                className="btn-primary"
                onClick={startShopping}
                disabled={neededCount === 0}
                style={{
                  opacity: neededCount === 0 ? 0.5 : 1,
                  cursor: neededCount === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Start Shopping
              </button>
            </div>

            <GroceryList
              items={items.filter(i => i.status === 'needed' || i.status === 'in_cart')}
              onUpdate={updateItem}
              onDelete={deleteItem}
            />
          </div>
        )}

        {activeTab === 'add' && (
          <div className="tab-content fade-in">
            <ItemForm onAdd={addItem} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tab-content fade-in">
            <ShoppingHistory history={history} onClearHistory={clearHistory} />
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="tab-bar">
        <button
          className={`tab-bar-btn${activeTab === 'database' ? ' active' : ''}`}
          onClick={() => setActiveTab('database')}
        >
          <span className="tab-bar-icon">📦</span>
          Database
        </button>

        <button
          className={`tab-bar-btn${activeTab === 'list' ? ' active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <span className="tab-bar-icon">🛒</span>
          {neededCount > 0 && <span className="tab-bar-badge">{neededCount}</span>}
          List
        </button>

        <button
          className={`tab-bar-btn${activeTab === 'add' ? ' active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <span className="tab-bar-icon">➕</span>
          Add
        </button>

        <button
          className={`tab-bar-btn${activeTab === 'history' ? ' active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="tab-bar-icon">🕐</span>
          {history.length > 0 && <span className="tab-bar-badge">{history.length}</span>}
          History
        </button>
      </nav>
    </div>
  );
}

export default App;
