export default function removeItem(item) {
    return {
        type: 'CHECK_ITEM',
        payload: item,
    }
}