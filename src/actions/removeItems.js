export default function removeItem(item,checked) {
    return {
        type: 'REMOVE_ITEM',
        payload: item,
        checked: checked
    }
}