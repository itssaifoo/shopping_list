import Dexie from 'dexie';

export const db = new Dexie('GroceryDatabase');

db.version(1).stores({
    items: '++id, name, category, aisle, status', // Primary key and indexed props
    history: '++id, date'
});
