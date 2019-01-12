export const initialState = {
    app_name: 'BulkaHleba',
    items: [{title: 'test'}]
};

function updateIndexDB(items) {
    // Open or create data base
    let request = indexedDB.open("bh_db", 1);

    // If DB allready created
    request.onsuccess = function(event) {
        // get DB object
        let db = event.target.result;
        // init transaction and select store name
        let items_transaction = db.transaction(["items"], "readwrite").objectStore("items");
        // Clear all data in store
        items_transaction.clear();
        // add updated items
        items.forEach(function(item){
            items_transaction.put(item);
        });
    };

    // If that is new data base
    request.onupgradeneeded = function(event) {
        // get DB object
        let db = event.target.result;
        // create store
        db.createObjectStore("items", { keyPath: "id", autoIncrement : true });
        // init transaction and select store name
        let items_transaction = event.target.transaction.objectStore(["items"], "readwrite");
        // add updated items
        items.forEach(function(product){
            items_transaction.add(product);
        });
    };

    // catch error exception
    request.onerror = function() {
        console.log('[onerror]', request.error);
    };
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
        case 'WRITE_ITEMS': {
            let exist_items = action.payload;
            return {...state, items: exist_items};
        }
        default:
            return state
    }
}