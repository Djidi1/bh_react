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

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: indigo,
        secondary: orange,
    },
});

async function getAllData(props, table) {
    openDb('bh_db', 1, upgradeDB => {
        if (upgradeDB.oldVersion === 0) {
            upgradeDB.createObjectStore(table, {keyPath: "key", autoIncrement: true});
        }
    }).then(async db => {
        let tx = db.transaction(table, 'readonly');
        let store = tx.objectStore(table);
        let allSavedItems = await store.getAll();
        props.writeItemsAction(allSavedItems, table);
        db.close();
        return allSavedItems;
    });
}

class App extends Component {
    componentDidMount() {
        (async () => {
            const items = await getAllData(this.props, 'items');
            const done_items = await getAllData(this.props, 'done_items');
            this.setState({items: items, done_items: done_items});
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
    return {
        app_bg: store.app.app_bg,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        writeItemsAction: (items, table) => dispatch(updateItems(items, table)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)