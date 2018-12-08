const initialState = [
        {
            message_id: 1,
            order_id: 1,
            user_id: 1,
            message: 'chat message',
            dk: '01.01.2019 12:00',
        }
    ]

;

export function messagesReducer(state = initialState) {
    return state
}