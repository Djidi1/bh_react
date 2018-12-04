const initialState = {
    year: 2018,
    photos: [],
}

export function pageReducer(state = initialState, action) {
    switch (action.type) {
        case 'OPEN_MENU':
            return { ...state, year: action.payload }

        default:
            return state
    }
}