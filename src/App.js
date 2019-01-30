import React, { Component } from 'react';
import {connect} from "react-redux";
import { HashRouter as Router, Route } from "react-router-dom";
import { openDb } from "idb";

import ButtonAppBar from './components/main';
import { Home, Login, About, Registration, Requests, WishLists} from './pages';
import updateItems from "./actions/updateItems";
import {createMuiTheme} from "@material-ui/core";
import {indigo, orange} from "@material-ui/core/colors";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import updateIDB from "./components/updateIndexDB";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: indigo,
        secondary: orange,
    },
});

async function getAllData(props, list) {
    openDb('bh_db', 1, upgradeDB => {
        if (upgradeDB.oldVersion === 0) {
            upgradeDB.createObjectStore(list);
        }
    }).then(async db => {
        let tx = db.transaction(list, 'readonly');
        let store = tx.objectStore(list);
        let allSavedItems = await store.getAll();
        let allSavedKeys = await store.getAllKeys();
        // create store table if not exist
        if (allSavedKeys.indexOf('items') === -1) {
            updateIDB({type: 'SET_ITEM', payload: ''}, 'items').then();
        }
        if (allSavedKeys.indexOf('done_items') === -1) {
            updateIDB({type: 'SET_ITEM', payload: ''}, 'done_items').then();
        }
        // save to store from idb
        let result_store = {};
        allSavedKeys.forEach(function (table, index) {
            result_store[table] = allSavedItems[index];
        });
        props.writeItemsAction(result_store, list);
        db.close();
        return allSavedItems;
    });
}

class App extends Component {
    componentDidMount() {
        (async () => {
            const list = await getAllData(this.props, 'list');
            if (list !== undefined) {
                const items = list.items || [];
                const done_items = list.done_items || [];
                this.setState({items: items, done_items: done_items});
            }
        })()
    }
    render() {
        return (
            <Router>
                <MuiThemeProvider theme={theme}>
                    <div className={'App' + (this.props.app_bg ? ' photo-background' : '')}>
                        <ButtonAppBar/>
                        <Route exact path='/' component={Home}/>
                        <Route path='/wishlists' component={WishLists}/>
                        <Route path='/requests' component={Requests}/>
                        <Route path='/registration' component={Registration}/>
                        <Route path='/login' component={Login}/>
                        <Route path='/about' component={About}/>
                    </div>
                </MuiThemeProvider>
            </Router>
        )
    }
}

// приклеиваем данные из store
const mapStateToProps = store => {
    console.log(store);
    return {
        app_bg: store.app.app_bg,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        writeItemsAction: (items, list_table) => dispatch(updateItems(items, list_table)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)