export const sortItems = (items) => {
    return [...items].sort((a, b) => {
        // robust natural sort for "Aisle 1", "Aisle 10", "Aisle 2"
        // If aisle is empty, put it at the end
        if (!a.aisle) return 1;
        if (!b.aisle) return -1;
        return a.aisle.localeCompare(b.aisle, undefined, { numeric: true, sensitivity: 'base' });
    });
};
