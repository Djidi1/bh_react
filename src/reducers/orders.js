const initialState = [
        {
            order_id: 1,
            car_id: 1,
            store_id: 1,
            message: 'Order text',
            status: 1,
            mark: 1,
            dk: '01.01.2019 12:00',
        }
    ]

;

export function ordersReducer(state = initialState) {
    return state
}