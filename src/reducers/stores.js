const initialState = [
        {
            store_id: 1,
            title: 'chat message',
            category: 1,
            address: '100',
            phone: '000 00 00',
            phone2: '111 11 11',
            comment: 'additional information',
            dk: '01.01.2019 12:00',
        }
    ]

;

export function storesReducer(state = initialState) {
    return state
}