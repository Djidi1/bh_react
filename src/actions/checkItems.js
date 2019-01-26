export default function checkItem(item,from,to) {
    return {
        type: 'CHECK_ITEM',
        payload: item,
        from: from,
        to: to
    }
}