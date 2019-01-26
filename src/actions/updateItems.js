export default function updateItems(items, table) {
    return {
        type: 'UPDATE_ITEMS',
        payload: items,
        table: table
    }
}