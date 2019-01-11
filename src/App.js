import React, { Component } from 'react'
import { connect } from 'react-redux'

import ButtonAppBar from './components/main'

import { Home, Login, About, Registration, Requests, WishLists} from './pages'
import { HashRouter as Router, Route } from "react-router-dom";



class App extends Component {
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
        user: store.user,
    }
};

export default connect(mapStateToProps)(App)