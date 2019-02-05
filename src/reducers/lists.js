export const initialState = {
        0: {
            title: 'Main List',
            items: [],
            done_items: []
        },
    };

export function listsReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_ITEMS': {
            let items = action.payload;
            if (state[action.list_key] !== undefined) {
                // save title
                items['title'] = items['title'] || state[action.list_key].title;
                if (action.table !== undefined) {
                    // Update only one table in store list
                    items = {...state[action.list_key], [action.table]: items};
                }
                return {...state, [action.list_key]: items};
            }else{
                return {...state, [action.list_key]: items};
            }
        }
        default:
            return state
    }
}