import React, {Component} from 'react';
import PropTypes from 'prop-types';
import connect from "react-redux/es/connect/connect";
import {withStyles} from "@material-ui/core/styles/index";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import DragIndicator from '@material-ui/icons/DragIndicator';

import SwipeToDelete from '../swipe_js/js/main';
import '../swipe_js/css/main.scss';


import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';

import Switch from '@material-ui/core/Switch';
import updateIDB from "./updateIndexDB";
import Slide from "@material-ui/core/Slide/Slide";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";


const styles = () => ({
    root: {
        width: '100%',
        opacity: 0.9,
    },
    checkbox: {
        padding: 0,
    },
    textField: {
        margin: '16px 8px',
        width: 'calc(100% - 30px)'
    },
    listItem: {
        margin: '2px 8px',
        borderRadius: '4px'
    },
    toggleLabel: {
        color: '#ffffff'
    },

    toggleRoot: {
        display: 'flex',
        justifyContent: 'center',
        margin: '8px 50px',
        backgroundColor: '#3F51B5',
        opacity: 0.8,
        borderRadius: 5,
        height: 36
    },
    doneItems: {
        textDecoration: 'line-through',
        opacity: 0.5,
    }
});

const DragHandle = SortableHandle(() => <span><DragIndicator color={"action"}/></span>);

const SortableItem = SortableElement(({value, index, classes, removeItem, checkItem}) => (
        <ListItemComponent index={index}
                           value={value}
                           classes={classes}
                           removeItem={removeItem}
                           checkItem={checkItem}/>
    )
);

const SortableList = SortableContainer(({items,classes,removeItem,checkItem}) => {
    return (
        <List
            dense
            disablePadding
            className={classes.root}
        >
            {items.map((item, index) => (
                <SortableItem
                    key={`item-${index}`}
                    classes={classes}
                    removeItem={removeItem}
                    checkItem={checkItem}
                    index={index}
                    value={item} />
            ))}
        </List>
    );
});

class SortableComponent extends Component {
    onSortEnd = ({oldIndex, newIndex}) => {
        let sorted_array = arrayMove(this.props.items, oldIndex, newIndex);
        sorted_array.forEach(function(item, index){
            item.order = index;
        });
        updateIDB({type: 'UPDATE_ITEMS', payload: sorted_array}, this.props.table).then();
    };
    render() {
        return <SortableList
            classes={this.props.classes}
            items={this.props.items}
            onSortStart={(_, event) => event.preventDefault()} // it does the trick
            onSortEnd={this.onSortEnd}
            lockAxis={'y'}
            helperClass={'drag-item'}
            useDragHandle
            lockToContainerEdges={true}
        />;
    }
}

class ListItemComponent extends Component {

    handleToggle = (item) => () => {
        item.checked = !item.checked;
        let from = 'items';
        let to = 'done_items';
        if (!item.checked) {
            from = 'done_items';
            to = 'items';
        }
        updateIDB({type: 'CHECK_ITEM', payload: item, from: from, to: to}).then();
    };

    handleClickRemoveItem = item => () => {
        let table = item.checked ? 'done_items' : 'items';
        updateIDB({type: 'REMOVE_ITEM', payload: item}, table).then();
    };

   /* handleChangeClass = item => () => {
        item.moving = true;
    };*/

    render() {
        const { classes, value } = this.props;
        return <div>
            <SwipeToDelete
            key={value.key}
            className={'rc-swipeout ' + classes.listItem}
            onDelete={this.handleClickRemoveItem(value)}

        >
            <ListItem
                role={undefined}
                dense
                >
                <Checkbox
                    className={classes.checkbox}
                    classes={{ root: value.checked ? classes.doneItems : '' }}
                    checked={value.checked}
                    tabIndex={-1}
                    disableRipple
                    onClick={this.handleToggle(value)}
                />
                <ListItemText primary={value.title}
                              classes={{ root: value.checked ? classes.doneItems : '' }}
                />
                <DragHandle />
            </ListItem>
        </SwipeToDelete>
        </div>;
    }
}

class ListItems extends React.Component {
    state = {
        fade_checked: false,
    };

    handleChange = () => {
        this.setState(state => ({ fade_checked: !state.fade_checked }));
    };

    render() {
        const { classes } = this.props;
        const { fade_checked } = this.state;

        let items = this.props.items || [];
        let done_items = this.props.done_items || [];

        items.forEach(function (item, key) {
            item['key'] = key;
        });

        done_items.forEach(function (item, key) {
            item['key'] = key;
        });

        return (
            <div>
                <SortableComponent
                    items={items}
                    classes={classes}
                    table='items'
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={fade_checked}
                            onChange={this.handleChange}
                            color="secondary"
                        />
                    }
                    label="Показать завершенные"
                    classes = {{ label: classes.toggleLabel, root: classes.toggleRoot }}
                />
                <Slide direction="up" mountOnEnter unmountOnExit in={fade_checked}>
                    <SortableComponent
                        items={done_items}
                        classes={classes}
                        table='done_items'
                    />
                </Slide>
            </div>
        );
    }
}

ListItems.propTypes = {
    classes: PropTypes.object.isRequired,
};

// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        items: store.app.list.items ? store.app.list.items.sort((a, b) => parseInt(a.order) - parseInt(b.order)) : [],
        done_items: store.app.list.done_items ? store.app.list.done_items.sort((a, b) => parseInt(a.order) - parseInt(b.order)) : [],
    }
};


export default connect(mapStateToProps)(withStyles(styles)(ListItems));