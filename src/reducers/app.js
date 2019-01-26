export const initialState = {
    app_name: 'BulkaHleba',
    items: [],
    done_items: []
};

export function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_ITEMS': {
            let items = action.payload;
            return {...state, [action.table]: items};
        }
        case 'SET_ITEM': {
            let new_items = [...state.items];
            new_items.unshift(action.payload);
            return {...state, items: new_items};
        }
        case 'REMOVE_ITEM': {
            let new_items = [...state.items];
            new_items.splice(action.payload, 1);
            return {...state, items: new_items};
        }
        case 'CHECK_ITEM': {
            let new_items = [...state.items];
            new_items.find(x => x === action.payload).checked = !(new_items.find(x => x === action.payload).checked);
            return {...state, items: new_items};
        }
        case 'DELETE_DB': {
            return state;
        }
        default:
            return state
    }
}