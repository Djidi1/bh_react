export const initialState = {
    app_name: 'Just To-Do',
    app_bg: true,
    list_key: 0,
    backend_url: 'http://localhost:8000'
};

export function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'HIDE_BG': {
            return {...state, app_bg: action.payload};
        }
        case 'SET_LIST_KEY': {
            return {...state, list_key: Number(action.payload)};
        }
        default:
            return state
    }
}