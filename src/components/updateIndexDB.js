import {deleteDb, openDb} from "idb";
import {store} from '../store/configureStore'
import updateItems from "../actions/updateItems";
import updateUser from "../actions/updateUser";
import removeList from "../actions/removeList";
import removeLists from "../actions/removeLists";
import updateBackups from "../actions/updateBackups";
import updateSettings from "../actions/updateSettings";

let db = 'bh_db';
let list_table = 'lists';
let user_table = 'user';
let backups_table = 'backups';
let settings_table = 'settings';

// create table on start app
const dbPromise = openDb(db, 7, upgradeDB => {
    // if updating new DB
    if (upgradeDB.oldVersion === 0) {
        upgradeDB.createObjectStore(list_table);
        upgradeDB.createObjectStore(user_table, {keyPath: "id", autoIncrement: true});
        upgradeDB.createObjectStore(backups_table, {keyPath: "id", autoIncrement: true});
    }
    // if updating exist DB and don't know last version
    if (upgradeDB.oldVersion > 0) {
        upgradeDB.createObjectStore(settings_table, {keyPath: "id", autoIncrement: true});
    }
});

const idbKeyval = {
    async get(table, key) {
        const db = await dbPromise;
        return db.transaction(table).objectStore(table).get(key);
    },
    async setUser(user) {
        const db = await dbPromise;
        const tx = db.transaction(user_table, 'readwrite');
        tx.objectStore(user_table).clear().then();
        tx.objectStore(user_table).put(user).then();
    },
    async setBackups(items) {
        const db = await dbPromise;
        const tx = db.transaction(backups_table, 'readwrite');
        tx.objectStore(backups_table).clear().then();
        tx.objectStore(backups_table).put(items).then();
    },
    async setSettings(items) {
        const db = await dbPromise;
        const tx = db.transaction(settings_table, 'readwrite');
        tx.objectStore(settings_table).clear().then();
        tx.objectStore(settings_table).put(items).then();
    },
    async set(list_table, list_key, table, val) {
        const db = await dbPromise;
        let list_items = await idbKeyval.getAllFromList(list_table, list_key);
        // takes first element of array
        list_items = list_items[0] !== undefined ? list_items[0] : list_items;

        // create clear store if not exist
        if (list_items[table] === undefined) {
            // convert to object
            list_items = {};
            list_items[table] = [];
        }
        // create clear store for 'done_items' if not exist
        if (list_items['done_items'] === undefined) {
            list_items['done_items'] = [];
        }

        Object.keys(list_items).forEach(function(index) {
            let items = list_items[index];
            if (table === index && val !== '') {
                items.push(val);
            }
        });

        const tx = db.transaction(list_table, 'readwrite');
        tx.objectStore(list_table).put(list_items, list_key).then();
        return tx.complete;
    },
    async setList(list_table, list_key, data) {
        const db = await dbPromise;
        const tx = db.transaction(list_table, 'readwrite');
        tx.objectStore(list_table).put(data, list_key).then();
        return tx.complete;
    },
    async deleteList(list_table, list_key) {
        const db = await dbPromise;
        const tx = db.transaction(list_table, 'readwrite');
        tx.objectStore(list_table).delete(list_key).then();
        return tx.complete;
    },
    async clear(table) {
        const db = await dbPromise;
        const tx = db.transaction(table, 'readwrite');
        tx.objectStore(table).clear().then();
        return tx.complete;
    },
    async getAllFromList(list_table, list_key) {
        const db = await dbPromise;
        return db.transaction(list_table).objectStore(list_table).getAll(list_key);
    },
    async getAllKeysFromList(list_table, list_key) {
        const db = await dbPromise;
        return db.transaction(list_table).objectStore(list_table).getAllKeys(list_key);
    },
    async getAllKeys(list_table) {
        const db = await dbPromise;
        return db.transaction(list_table).objectStore(list_table).getAllKeys();
    },
};

async function syncStoreIdb(list_table, list_key) {
    let allSavedLists = await idbKeyval.getAllFromList(list_table, list_key);
    // save to store from idb
    allSavedLists.forEach(function (_, index) {
        store.dispatch(updateItems(allSavedLists[index], list_key));
    });
}

async function updateIDB(action, table, list_table) {
    let list_key = store.getState().app.list_key;

    switch (action.type) {
        case 'SET_LIST_TITLE': {
            let list_key = Number(action.list_key);
            // update store
            store.dispatch(updateItems(action.payload, list_key));
            // get data from app store
            let new_data = store.getState().lists[list_key];
            // update IDB
            await idbKeyval.deleteList(list_table, list_key);
            await idbKeyval.setList(list_table, list_key, new_data);
            break;
        }
        case 'SET_LIST': {
            let list_table = 'lists';
            let list_keys = await idbKeyval.getAllKeys(list_table);
            let list_key = Math.max(...list_keys) + 1;
            console.log(list_key, action);
            await idbKeyval.setList(list_table, list_key, action.payload);
            syncStoreIdb(list_table, list_key).then();
            break;
        }
        case 'SET_ITEM': {
            await idbKeyval.set(list_table, list_key, table, action.payload);
            syncStoreIdb(list_table, list_key).then();
            break;
        }
        case 'REMOVE_ITEM': {
            // 1. get all data in table
            let all_lists = await idbKeyval.getAllFromList(list_table, list_key);
            all_lists = all_lists[0] !== undefined ? all_lists[0] : all_lists;
            let result_store = {};

            Object.keys(all_lists).forEach(function (table_key) {
                // 2. delete from "from" table
                if (table_key === table) {
                    all_lists[table_key].splice(action.payload.key,1);
                }
                result_store[table_key] = all_lists[table_key];
            });

            // 4. update stores
            store.dispatch(updateItems(result_store, list_key));
            // 5. update IDB
            await idbKeyval.deleteList(list_table, list_key);
            await idbKeyval.setList(list_table, list_key, result_store);
            break;
        }
        case 'CHECK_ITEM': {
            // 1. get all data in list
            let all_lists = await idbKeyval.getAllFromList(list_table, list_key);
            // prepare data for storage
            let result_store = {};
            let all_list = all_lists[0];
            Object.keys(all_list).forEach(function (table) {
                // 2. delete from "from" table
                if (table === action.from) {
                    all_list[table].splice(action.payload.key,1);
                } else if (table === action.to) {
                    // 3. add to "to" table
                    all_list[table].unshift(action.payload);
                }
                result_store[table] = all_list[table];
            });
            // 4. update stores
            store.dispatch(updateItems(result_store, list_key));

            // 5. update IDB
            await idbKeyval.deleteList(list_table, list_key);
            await idbKeyval.setList(list_table, list_key, result_store);

            break;
        }
        case 'RENAME_ITEM': {
            // 1. get all data in list
            let all_lists = await idbKeyval.getAllFromList(list_table, list_key);
            // 2. prepare data for storage
            let result_store = all_lists[0];
            console.log(result_store, action.payload);
            // 3. update item in store
            if (action.payload.checked) {
                result_store['done_items'][action.payload.key] = action.payload;
            }else{
                result_store['items'][action.payload.key] = action.payload;
            }

            // 4. update stores
            store.dispatch(updateItems(result_store, list_key));

            // 5. update IDB
            await idbKeyval.deleteList(list_table, list_key);
            await idbKeyval.setList(list_table, list_key, result_store);

            break;
        }
        case 'UPDATE_ITEMS': {
            // update store
            store.dispatch(updateItems(action.payload, list_key, table));
            // get data from app store
            let new_data = store.getState().lists[list_key];
            // update IDB
            await idbKeyval.deleteList(list_table, list_key);
            await idbKeyval.setList(list_table, list_key, new_data);
            break;
        }
        case 'RECOVER_LISTS': {
            let data = JSON.parse(action.payload);
            const list_table = 'lists';
            await idbKeyval.clear(list_table);
            // clear store
            store.dispatch(removeLists());
            Object.keys(data).forEach(async function(key) {
                const list_key = Number(key);
                // update store
                store.dispatch(updateItems(data[list_key], list_key));
                // get data from app store
                let new_data = store.getState().lists[list_key];
                // update IDB
                await idbKeyval.deleteList(list_table, list_key);
                await idbKeyval.setList(list_table, list_key, new_data);
            });
            break;
        }
        case 'REMOVE_LIST': {
            const list_table = 'lists';
            // update store
            store.dispatch(removeList(Number(action.payload)));
            // update idb
            await idbKeyval.deleteList(list_table, Number(action.payload));
            break;
        }
        case 'DELETE_DB': {
            deleteDb(db).then();
            break;
        }
        case 'SET_USER': {
            await idbKeyval.setUser(action.payload);
            store.dispatch(updateUser(action.payload));
            break;
        }
        case 'SET_BACKUPS': {
            await idbKeyval.setBackups(action.payload);
            store.dispatch(updateBackups(action.payload));
            break;
        }
        case 'SET_AUTO_SAVE': {
            await idbKeyval.setSettings(action.payload);
            store.dispatch(updateSettings(action.payload));
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