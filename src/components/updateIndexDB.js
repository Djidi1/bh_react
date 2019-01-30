import {deleteDb, openDb} from "idb";
import {store} from '../store/configureStore'
import updateItems from "../actions/updateItems";

let db = 'bh_db';
let list_table = 'list';

// create table on start app
const dbPromise = openDb(db, 1, upgradeDB => {
    upgradeDB.createObjectStore(list_table);
});

const idbKeyval = {
    async get(table, key) {
        const db = await dbPromise;
        return db.transaction(table).objectStore(table).get(key);
    },
    async set(list_table, table, val) {
        const db = await dbPromise;
        let list_items = await idbKeyval.getAll(list_table, table);
        list_items = (list_items[0] === undefined) ? [] : list_items[0];
        if (val !== '') {
            list_items.push(val);
        }
        const tx = db.transaction(list_table, 'readwrite');
        tx.objectStore(list_table).put(list_items, table).then();
        return tx.complete;
    },
    async setTable(list_table, table, data) {
        const db = await dbPromise;
        const tx = db.transaction(list_table, 'readwrite');
        tx.objectStore(list_table).put(data, table).then();
        return tx.complete;
    },
    async deleteTable(list_table, table) {
        const db = await dbPromise;
        const tx = db.transaction(list_table, 'readwrite');
        tx.objectStore(list_table).delete(table).then();
        return tx.complete;
    },
    async clear(table) {
        const db = await dbPromise;
        const tx = db.transaction(table, 'readwrite');
        tx.objectStore(table).clear().then();
        return tx.complete;
    },
    async getAll(list_table, table) {
        const db = await dbPromise;
        return db.transaction(list_table).objectStore(list_table).getAll(table);
    },
    async getAllKeys(list_table, table) {
        const db = await dbPromise;
        return db.transaction(list_table).objectStore(list_table).getAllKeys(table);
    },
    async getAllFromList(list_table) {
        const db = await dbPromise;
        return db.transaction(list_table).objectStore(list_table).getAll();
    },
    async getAllKeysFromList(list_table) {
        const db = await dbPromise;
        return db.transaction(list_table).objectStore(list_table).getAllKeys();
    },
};

async function syncStoreIdb(list_table, table) {
    let allSavedItems = await idbKeyval.getAll(list_table, table);
    let allSavedKeys = await idbKeyval.getAllKeys(list_table, table);
    // save to store from idb
    allSavedKeys.forEach(function (table, index) {
        store.dispatch(updateItems(allSavedItems[index], list_table, table));
    });
}

async function updateIDB(action, table) {
    const list_table = 'list';
    switch (action.type) {
        case 'SET_ITEM': {
            await idbKeyval.set(list_table, table, action.payload);
            syncStoreIdb(list_table, table).then();
            break;
        }
        case 'REMOVE_ITEM': {
            await idbKeyval.delete(list_table, table, action.payload.key);
            let new_store = await idbKeyval.getAll(table);
            store.dispatch(updateItems(new_store, table));
            break;
        }
        case 'CHECK_ITEM': {
            // 1. get all data in list
            let all_list = await idbKeyval.getAllFromList(list_table);
            let all_keys = await idbKeyval.getAllKeysFromList(list_table);

            // prepare data for storage
            let result_store = {};
            all_keys.forEach(async function (key, index) {
                // 2. delete from "from" table
                if (key === action.from) {
                    all_list[index].splice(action.payload.key,1);
                } else if (key === action.to) {
                    // 3. add to "to" table
                    all_list[index].unshift(action.payload);
                }
                result_store[key] = all_list[index];
            });
            // 4. update stores
            store.dispatch(updateItems(result_store, list_table));

            // 5. update idb
            all_keys.forEach(async function (key, index) {
                // 2. delete from "from" table
                if (key === action.from) {
                    await idbKeyval.deleteTable(list_table, key);
                    await idbKeyval.setTable(list_table, key, all_list[index]);
                } else if (key === action.to) {
                    // 3. add to "to" table
                    await idbKeyval.deleteTable(list_table, key);
                    await idbKeyval.setTable(list_table, key, all_list[index]);
                }
            });
            break;
        }
        case 'UPDATE_ITEMS': {
            let new_items = action.payload;
            // update store
            store.dispatch(updateItems(new_items, table));
            // update IDB
            await idbKeyval.clear(table);
            new_items.forEach(async function (item) {
                await idbKeyval.set(table, item);
            });
            break;
        }
        case 'DELETE_DB': {
            deleteDb(db).then();
            break;
        }
        default:
            break;
    }
}

/*
const mapDispatchToProps = dispatch => {
    return {
        updateItemsAction: (items, checked) => dispatch(updateItems(items, checked)),
    }
};
*/


export default (updateIDB);