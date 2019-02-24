const initialState = {
    user_id: 0,
    name: 'User Name',
    email: 'user@name.email',
};

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_USER': {
            return action.payload || state;
        }
        default:
            return state
    }
}