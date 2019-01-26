import {deleteDb, openDb} from "idb";
import {store} from '../store/configureStore'
import updateItems from "../actions/updateItems";

let db = 'bh_db';
let main_table = 'items';
let done_table = 'done_items';

// create table on start app
const dbPromise = openDb(db, 1, upgradeDB => {
    upgradeDB.createObjectStore(main_table, {keyPath: "key", autoIncrement: true});
    upgradeDB.createObjectStore(done_table, {keyPath: "key", autoIncrement: true});
});

const idbKeyval = {
    async get(table, key) {
        const db = await dbPromise;
        return db.transaction(table).objectStore(table).get(key);
    },
    async set(table, val) {
        const db = await dbPromise;
        const tx = db.transaction(table, 'readwrite');
        tx.objectStore(table).put(val).then();
        return tx.complete;
    },
    async delete(table, key) {
        const db = await dbPromise;
        const tx = db.transaction(table, 'readwrite');
        tx.objectStore(table).delete(key).then();
        return tx.complete;
    },
    async clear(table) {
        const db = await dbPromise;
        const tx = db.transaction(table, 'readwrite');
        tx.objectStore(table).clear().then();
        return tx.complete;
    },
    async getAll(table) {
        const db = await dbPromise;
        return db.transaction(table).objectStore(table).getAll();
    },
};
/*
async function updateIndexDB(items, checked) {
    console.log(items);
    console.log(checked);
    idbKeyval.getAll().then(value => {
        let del_items = value.filter(x => checked === undefined || x.checked === checked || (x.checked === undefined && !checked));
        console.log(del_items);
        del_items.forEach(function(item) {
            // delete prev value
            if (item.id) {
                idbKeyval.delete(item.id);
            }
        });
    });
    console.log(1);
    // add new one
    await items.forEach(function(item, index) {
        idbKeyval.set(index,item);
    });

    console.log(2);
    // update state from db
    idbKeyval.getAll().then(value => {

        console.log(value);
        updateState(value)
    });

}
*/

async function updateIDB(action, table) {
    // let main_table = 'items';
    // let done_table = 'done_items';

    switch (action.type) {
        case 'SET_ITEM': {
            await idbKeyval.set(table, action.payload);
            let new_store = await idbKeyval.getAll(table);
            store.dispatch(updateItems(new_store, table));
            break;
        }
        case 'REMOVE_ITEM': {
            await idbKeyval.delete(table, action.payload.key);
            let new_store = await idbKeyval.getAll(table);
            store.dispatch(updateItems(new_store, table));
            break;
        }
        case 'CHECK_ITEM': {
            await idbKeyval.delete(action.from, action.payload.key);
            await idbKeyval.set(action.to, action.payload);
            // update "from" store
            let from_items = await idbKeyval.getAll(action.from);
            store.dispatch(updateItems(from_items, action.from));
            // update "to" store
            let to_items = await idbKeyval.getAll(action.to);
            store.dispatch(updateItems(to_items, action.to));
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