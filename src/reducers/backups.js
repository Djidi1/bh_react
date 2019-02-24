const initialState = {
};

export function backupsReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_BACKUPS': {
            return action.payload || state;
        }
        default:
            return state
    }
}

