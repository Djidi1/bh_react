import React, { Component } from 'react';
import {connect} from 'react-redux';
import AddThinks from './AddThinks'
import ListItems from './ListItems'


import setItem from '../actions/addItems'
import removeItem from '../actions/removeItems'


class ListThinks extends Component {
    render() {
        const { items, setItemAction, removeItemAction } = this.props;

        return (
            <div>
                <AddThinks setItem={setItemAction}/>
                <ListItems items={items} removeItem={removeItemAction}/>
            </div>
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
        setItemAction: item => dispatch(setItem(item)),
        removeItemAction: item => dispatch(removeItem(item)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ListThinks);