import React, { Component } from 'react';
import AddThinks from './AddThinks'
import ListItems from './ListItems'


class ListThinks extends Component {
    render() {
        return (
            <div>
                <AddThinks/>
                <ListItems/>
            </div>
        )
    }
}


export default (ListThinks);