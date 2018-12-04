import React, { Component } from 'react'
import { connect } from 'react-redux'

import ButtonAppBar from './components/main'



class App extends Component {
    render() {
        return (
            <div className="App">
                <ButtonAppBar/>
                {this.props.user}
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