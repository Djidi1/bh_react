import React, { Component } from 'react'
import { connect } from 'react-redux'

import Typography from '@material-ui/core/Typography';

import ButtonAppBar from './components/main'
import ListThinks from './components/ListThinks'



class App extends Component {
    render() {
        return (
            <div className="App">
                <ButtonAppBar/>
                <Typography variant="h6">
                    Список покупок
                </Typography>
                <ListThinks/>
            </div>
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