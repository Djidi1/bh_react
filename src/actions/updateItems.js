export default function updateItems(items, list_table, table) {
    return {
        type: 'UPDATE_ITEMS',
        payload: items,
        list_table: list_table,
        table: table
    }
}