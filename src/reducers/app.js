export const initialState = {
    app_name: 'BulkaHleba',
    app_bg: true,
    list: {
        items: [],
        done_items: []
    }
};

export function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_ITEMS': {
            let items = action.payload;
            if (action.table !== undefined) {
                // Update only one table in store list
                items = {...state[action.list_table], [action.table]: items};
            }
            return {...state, [action.list_table]: items};
        }
        case 'REMOVE_ITEM': {
            let new_items = [...state.items];
            new_items.splice(action.payload, 1);
            return {...state, items: new_items};
        }
        case 'HIDE_BG': {
            return {...state, app_bg: action.payload};
        }
        case 'DELETE_DB': {
            return state;
        }
        default:
            return state
    }
}