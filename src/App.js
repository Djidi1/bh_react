import React, { Component } from 'react';
import {connect} from "react-redux";
import { HashRouter as Router, Route } from "react-router-dom";
import { openDb } from "idb";
import updateIDB from "./components/updateIndexDB";

import ButtonAppBar from './components/main';
import { Home, Login, About, Registration, Requests, Lists} from './pages';
import updateItems from "./actions/updateItems";

import {createMuiTheme} from "@material-ui/core";
import {indigo, orange} from "@material-ui/core/colors";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import 'typeface-roboto';

import Fade from "@material-ui/core/Fade/Fade";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: indigo,
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
    openDb('bh_db', 1, upgradeDB => {
        if (upgradeDB.oldVersion === 0) {
            upgradeDB.createObjectStore(lists);
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
        db.close();
        return allSavedLists;
    });
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
                console.log(lists);
                const items = lists.items || [];
                const done_items = lists.done_items || [];
                this.setState({items: items, done_items: done_items});
            }
        })()
    }



    render() {
        const { loading } = this.state;
        return (
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
                        <Route exact path='/' component={Home}/>
                        <Route path='/lists' component={Lists}/>
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
        writeItemsAction: (items, list_key) => dispatch(updateItems(items, list_key)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)