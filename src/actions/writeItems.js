export default function writeItems(items) {
    return {
        type: 'WRITE_ITEMS',
        payload: items,
    }
}