export default function removeItem(item) {
    return {
        type: 'REMOVE_ITEM',
        payload: item,
    }
}