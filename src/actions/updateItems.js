export default function updateItems(items, list_key, table) {
    return {
        type: 'UPDATE_ITEMS',
        payload: items,
        list_key: list_key,
        table: table
    }
}