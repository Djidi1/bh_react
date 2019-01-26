export default function setItem(item,checked) {
    return {
        type: 'SET_ITEM',
        payload: item,
        checked: checked
    }
}