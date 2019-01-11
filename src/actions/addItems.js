export default function setItem(item) {
    return {
        type: 'SET_ITEM',
        payload: item,
    }
}