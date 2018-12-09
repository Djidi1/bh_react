import React, { Component } from 'react'
import { connect } from 'react-redux'

import Typography from '@material-ui/core/Typography';

import ButtonAppBar from './components/main'
import ListThinks from './components/ListThinks'

import HomePage from './pages/Home'
import AboutPage from './pages/About'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";



class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <ButtonAppBar/>
                    <Typography variant="h6">
                        Список покупок
                    </Typography>
                    <ListThinks/>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/about/">About</Link>
                            </li>
                        </ul>
                    </nav>
                    <Route exact path='/' component={HomePage}/>
                    <Route path='/about' component={AboutPage}/>
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