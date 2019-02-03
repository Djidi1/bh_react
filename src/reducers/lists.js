export const initialState = {
        0: {
            title: 'test',
            items: [],
            done_items: []
        },
        1: {
            title: 'test2',
            items: [],
            done_items: []
        },
    };

export function listsReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_ITEMS': {
            let items = action.payload;
            console.log(action);
            // save title
            items['title'] = state[action.list_key].title;
            if (action.table !== undefined) {
                // Update only one table in store list
                items = {...state[action.list_key], [action.table]: items};
            }
            return {...state, [action.list_key]: items};
        }
        default:
            return state
    }
}