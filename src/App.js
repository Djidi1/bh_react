import React, {Component, Suspense} from 'react';
import {connect} from "react-redux";
import { HashRouter as Router, Route } from "react-router-dom";
import { openDb } from "idb";
import updateIDB from "./components/updateIndexDB";

import ButtonAppBar from './components/main';
import { Home, About, Lists} from './pages';
import updateItems from "./actions/updateItems";

import {createMuiTheme} from "@material-ui/core";
import {deepPurple, orange} from "@material-ui/core/colors";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import Fade from "@material-ui/core/Fade/Fade";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import updateUser from "./actions/updateUser";
import updateBackups from "./actions/updateBackups";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: deepPurple,
        secondary: orange,
    },
    loader: {
        position: 'absolute',
        width: '100%',
        height: '100vh',
        zIndex: '10001',
        padding: '50%',
        background: '#fff',
        paddingLeft: 'calc(50% - 20px)',
        paddingTop: 'calc(50vh - 20px)',
        opacity: .8,
    }
});

async function getAllData(props, lists) {
    openDb('bh_db', 6, upgradeDB => {
        // if updating new DB
        if (upgradeDB.oldVersion === 0) {
            upgradeDB.createObjectStore(lists);
            upgradeDB.createObjectStore('user', {keyPath: "id", autoIncrement: true});
            upgradeDB.createObjectStore('backups', {keyPath: "id", autoIncrement: true});
        }
        // if updating exist DB and don't know last version
        if (upgradeDB.oldVersion > 0) {
            upgradeDB.createObjectStore('backups', {keyPath: "id", autoIncrement: true});
        }
    }).then(async db => {
        let tx = db.transaction(lists, 'readonly');
        let store = tx.objectStore(lists);
        let allSavedLists = await store.getAll();
        allSavedLists.forEach(function (saved_list_items, list_key) {
            // create store table if not exist
            if (!saved_list_items.hasOwnProperty("items")) {
                updateIDB({type: 'SET_ITEM', payload: ''}, 'items', lists, list_key).then(function () {
                    if (saved_list_items.indexOf('done_items') === -1) {
                        updateIDB({type: 'SET_ITEM', payload: ''}, 'done_items', lists, list_key).then();
                    }
                });
            }
            // init and save to store from idb
            let result_store = {
                title: saved_list_items['title'] || 'test list',
                items: saved_list_items['items'] || [],
                done_items: saved_list_items['done_items'] || []
            };
            props.writeItemsAction(result_store, list_key);
        });
        // get User from store
        store = db.transaction('user', 'readonly').objectStore('user');
        store.getAll()
            .then((user) => props.writeUserAction(user[0]))
            .catch((err) => console.log(err));
        // get Backups from store
        store = db.transaction('backups', 'readonly').objectStore('backups');
        store.getAll()
            .then((backups) => props.writeBackupsAction(backups[0]))
            .catch((err) => console.log(err));
        db.close();
        return allSavedLists;
    })
}

class App extends Component {
    state = {
        loading: true,
    };

    componentDidMount() {
        ( () => {
            let lists = getAllData(this.props, 'lists');
            if (lists !== undefined) {
                lists = lists[0] !== undefined ? lists[0] : lists;
                this.setState({loading: false});
                const items = lists.items || [];
                const done_items = lists.done_items || [];
                this.setState({items: items, done_items: done_items});
            }
        })()
    }



    render() {
        const { loading } = this.state;
        return (
            <Suspense fallback={<CircularProgress/>}>
            <Router>
                <MuiThemeProvider theme={theme}>
                    {this.state.loading ?
                        <div style={theme.loader}>
                            <Fade
                                in={loading}
                                style={{
                                    transitionDelay: '0ms',
                                }}
                                unmountOnExit
                            >
                                <CircularProgress/>
                            </Fade>
                        </div> : ''
                    }
                    <div className={'App' + (this.props.app_bg ? ' photo-background' : '')}>
                        <ButtonAppBar/>
                        <Route exact path='/' component={Lists}/>
                        <Route exact path='/list' component={Home}/>
                        <Route path='/lists' component={Lists}/>
                        <Route path='/about' component={About}/>
                    </div>
                </MuiThemeProvider>
            </Router>
            </Suspense>
        )
    }
}

// приклеиваем данные из store
const mapStateToProps = store => {
    // console.log(React.version);
    // console.log(store);
    return {
        app_bg: store.app.app_bg,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        writeItemsAction: (items, list_key) => dispatch(updateItems(items, list_key)),
        writeUserAction: (user) => dispatch(updateUser(user)),
        writeBackupsAction: (backups) => dispatch(updateBackups(backups)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)