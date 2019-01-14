import React, { Component } from 'react';
import {connect} from "react-redux";
import { HashRouter as Router, Route } from "react-router-dom";
import { openDb } from "idb";

import ButtonAppBar from './components/main';
import { Home, Login, About, Registration, Requests, WishLists} from './pages';
import writeItems from "./actions/writeItems";

async function getAllData(props) {
    openDb('bh_db', 1, upgradeDB => {
        if (upgradeDB.oldVersion === 0) {
            upgradeDB.createObjectStore("items", {keyPath: "id", autoIncrement: true});
        }
    }).then(async db => {
        let tx = db.transaction('items', 'readonly');
        let store = tx.objectStore('items');
        // add, clear, count, delete, get, getAll, getAllKeys, getKey, put
        let allSavedItems = await store.getAll();
        props.writeItemsAction(allSavedItems);
        db.close();
        return allSavedItems;
    });
}

class App extends Component {
    componentDidMount() {
        (async () => {
            const items = await getAllData(this.props);
            this.setState({items: items});
        })()
    }
    render() {
        return (
            <Router>
                <div className="App">
                    <ButtonAppBar/>
                    <Route exact path='/' component={Home}/>
                    <Route path='/wishlists' component={WishLists}/>
                    <Route path='/requests' component={Requests}/>
                    <Route path='/registration' component={Registration}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/about' component={About}/>
                </div>
            </Router>
        )
    }
}

// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        items: store.app.items,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        writeItemsAction: items => dispatch(writeItems(items)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)