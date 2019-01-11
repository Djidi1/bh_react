export const initialState = {
    app_name: 'BulkaHleba',
    items: [{title: 'item_1'},{title: 'item_2'},{title: 'item_3'},{title: 'item_4'}]
};

export function appReducer(state = initialState, action) {
    switch (action.type) {
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
        default:
            return state
    }
}