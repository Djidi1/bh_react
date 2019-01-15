import { openDb, deleteDb } from 'idb';

export const initialState = {
    app_name: 'BulkaHleba',
    items: []
};



function updateIndexDB(items) {
    openDb('bh_db', 1).then(db => {
        const tx = db.transaction('items', 'readwrite');
        tx.objectStore('items').clear();
        // tx.objectStore('items').put(items);
        items.forEach(function(item){
            tx.objectStore('items').put(item);
        });
        return tx.complete;
    }).then(() => console.log("Done!"));
}

function deleteIndexDB() {
    console.log('clear DB');
    deleteDb('bh_db');
}



export function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_ITEM': {
            // Update data in redux store
            let new_items = [...state.items];
            new_items.unshift(action.payload);
            // Update data in indexDB store
            updateIndexDB(new_items);
            return {...state, items: new_items};
        }
        case 'REMOVE_ITEM': {
            let new_items = [...state.items];
            new_items.splice(action.payload, 1);
            updateIndexDB(new_items);
            return {...state, items: new_items};
        }
        case 'CHECK_ITEM': {
            let new_items = [...state.items];
            new_items.find(x => x === action.payload).checked = !(new_items.find(x => x === action.payload).checked);
            updateIndexDB(new_items);
            return {...state, items: new_items};
        }
        case 'WRITE_ITEMS': {
            let exist_items = action.payload;
            return {...state, items: exist_items};
        }
        case 'UPDATE_ITEMS': {
            let items = action.payload;
            updateIndexDB(items);
            return {...state, items: items};
        }
        case 'DELETE_DB': {
            deleteIndexDB();
            return state;
        }
        default:
            return state
    }
}