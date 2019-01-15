import React, { Component } from 'react';
import {connect} from 'react-redux';
import AddThinks from './AddThinks'
import ListItems from './ListItems'


import setItem from '../actions/addItems'
import removeItem from '../actions/removeItems'
import checkItem from '../actions/checkItems'


class ListThinks extends Component {
    render() {
        const { setItemAction, removeItemAction, checkItemAction } = this.props;
        return (
            <div>
                <AddThinks setItem={setItemAction}/>
                <ListItems removeItem={removeItemAction} checkItem={checkItemAction}/>
            </div>
        )
    }
}

// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        items1: store.app.items,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setItemAction: item => dispatch(setItem(item)),
        removeItemAction: item => dispatch(removeItem(item)),
        checkItemAction: item => dispatch(checkItem(item)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ListThinks);