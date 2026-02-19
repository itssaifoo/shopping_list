import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import MasterList from './components/MasterList'
import ShoppingMode from './components/ShoppingMode'
import ItemForm from './components/ItemForm'
import { db } from './db'
import { useLiveQuery } from 'dexie-react-hooks'

function App() {
  const [session, setSession] = useState(null)
  const [activeTab, setActiveTab] = useState('list') // list, database, add
  const [mode, setMode] = useState('manage') // manage, shopping

  // Local (Guest) Data
  const localItems = useLiveQuery(() => db.items.toArray()) || []

  // Supabase Data
  const [supabaseItems, setSupabaseItems] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchSupabaseData()
    }
  }, [session])

  const fetchSupabaseData = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
    if (!error && data) setSupabaseItems(data)
  }

  // Derived State
  const isGuest = session === 'offline_placeholder'
  const items = (session && !isGuest) ? supabaseItems : localItems

  const shoppingListItems = items.filter(i => i.status === 'needed' || i.status === 'in_cart')

  // Actions
  const addItem = async (item) => {
    if (session && !isGuest) {
      const { error } = await supabase.from('items').insert([item])
      if (error) {
        console.error('Error adding to Supabase:', error);
        alert('Failed to save to cloud: ' + error.message);
      } else {
        fetchSupabaseData();
      }
    } else {
      await db.items.add(item)
    }
  }

  const updateItem = async (updated) => {
    if (session && !isGuest) {
      const { error } = await supabase.from('items').update(updated).eq('id', updated.id)
      if (!error) fetchSupabaseData()
    } else {
      await db.items.put(updated)
    }
  }

  const deleteItem = async (id) => {
    // No confirmation needed for smoother UX
    if (session && !isGuest) {
      const { error } = await supabase.from('items').delete().eq('id', id)
      if (error) {
        console.error('Error deleting from Supabase:', error);
        alert('Failed to delete: ' + error.message);
      } else {
        fetchSupabaseData();
      }
    } else {
      await db.items.delete(id)
    }
  }

  const startShopping = () => {
    setMode('shopping')
  }

  const finishShopping = async () => {
    if (window.confirm('Finish shopping? Checked items will be reset to "Not Needed".')) {
      const cartItems = items.filter(i => i.status === 'in_cart')

      for (const item of cartItems) {
        await updateItem({ ...item, status: 'not_needed' })
      }
      setMode('manage')
    }
  }

  if (!session) {
    return (
      <div>
        <Auth />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="btn-secondary" onClick={() => setSession('offline_placeholder')}>
            Continue as Guest (Offline)
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'shopping') {
    return (
      <div className="app-container" style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
        <ShoppingMode
          items={items}
          onUpdate={updateItem}
          onFinish={finishShopping}
          onAdd={addItem}
          onExit={() => setMode('manage')}
        />
      </div>
    )
  }

  return (
    <div className="app-container">
      <div style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Grocery Tracker</h2>
        <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isGuest ? 'Guest Mode' : 'Cloud Sync Active'}
          {!isGuest && (
            <>
              <button
                onClick={() => {
                  const commands = `alter table items add column if not exists is_essential boolean default false;
alter table items add column if not exists price numeric default 0;
alter table items add column if not exists quantity numeric default 1;`;
                  navigator.clipboard.writeText(commands);
                  alert("SQL Copied to Clipboard!\n\nPaste this into your Supabase SQL Editor:\n" + commands);
                }}
                style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe' }}
              >
                Fix Database
              </button>
              <button onClick={() => supabase.auth.signOut()} style={{ marginLeft: '5px', fontSize: '0.7rem' }}>Log Out</button>
            </>
          )}
        </div>
      </div>

      <div className="content-area">
        {activeTab === 'list' && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0 }}>Ready to Shop?</h3>
              <p style={{ color: '#666' }}>{shoppingListItems.length} items on your list.</p>
              <button
                onClick={startShopping}
                className="btn-primary"
                style={{ fontSize: '1.2rem', padding: '15px 40px', width: '100%', maxWidth: '300px' }}
                disabled={shoppingListItems.length === 0}
              >
                Start Shopping
              </button>
            </div>

            {/* Preview List */}
            {shoppingListItems.length > 0 && (
              <div className="card">
                <h4 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Current List Preview</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {shoppingListItems.slice(0, 5).map(i => (
                    <li key={i.id} style={{ marginBottom: '5px' }}>{i.name} {i.aisle ? `(Aisle ${i.aisle})` : ''}</li>
                  ))}
                  {shoppingListItems.length > 5 && <li>...and {shoppingListItems.length - 5} more</li>}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'database' && (
          <div className="fade-in">
            <MasterList items={items} onUpdate={updateItem} onDelete={deleteItem} />
          </div>
        )}

        {activeTab === 'add' && (
          <div className="fade-in">
            <ItemForm onAdd={addItem} />
          </div>
        )}
      </div>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          Overview
        </button>
        <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          Add Item
        </button>
        <button className={`tab-btn ${activeTab === 'database' ? 'active' : ''}`} onClick={() => setActiveTab('database')}>
          Inventory
        </button>
      </div>
    </div>
  )
}

export default App
