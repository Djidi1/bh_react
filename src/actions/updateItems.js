export default function writeItems(items) {
    return {
        type: 'UPDATE_ITEMS',
        payload: items,
    }
}