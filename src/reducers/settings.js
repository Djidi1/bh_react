export const initialState = {
    backup: {},
};

export function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_SETTINGS': {
            return {...state, backup: action.payload};
        }
        default:
            return state
    }
}