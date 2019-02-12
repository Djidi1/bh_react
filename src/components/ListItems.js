import React, {Component} from 'react';
import {withTranslation} from "react-i18next";
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
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";

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
    showDone: {
        padding: '8px 50px',
    },
    toggleRoot: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#7e57c2',
        opacity: 0.8,
        borderRadius: 5,
        height: 36,
        margin: 0,
    },
    doneItems: {
        textDecoration: 'line-through',
        opacity: 0.5,
    },

    item: {
        fontWeight: '300',
        fontSize: '1rem !important'
    }
});

const DragHandle = SortableHandle(() => <span><DragIndicator color={"action"}/></span>);

const SortableItem = SortableElement(({value, index, classes, t, removeItem, checkItem}) => (
        <ListItemComponent index={index}
                           value={value}
                           classes={classes}
                           t={t}
                           removeItem={removeItem}
                           checkItem={checkItem}/>
    )
);

const SortableList = SortableContainer(({items,classes,t,removeItem,checkItem}) => {
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
                    t={t}
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
        const { items, table, list_key } = this.props;
        let sorted_array = arrayMove(items, oldIndex, newIndex);
        sorted_array.forEach(function(item, index){
            item.order = index;
        });
        updateIDB({type: 'UPDATE_ITEMS', payload: sorted_array}, table, 'lists', list_key).then();
    };
    render() {
        return <SortableList
            classes={this.props.classes}
            t={this.props.t}
            items={this.props.items}
            onSortStart={(_, event) => (event.preventDefault())} // it does the trick
            onSortEnd={this.onSortEnd}
            lockAxis={'y'}
            helperClass={'drag-item'}
            useDragHandle
            lockToContainerEdges={true}
        />;
    }
}

class ListItemComponent extends Component {
    state = {
        action: '',
        open: false,
        edit_item: ''
    };

    handleToggle = (item) => () => {
        item.checked = !item.checked;
        let from = 'items';
        let to = 'done_items';
        if (!item.checked) {
            from = 'done_items';
            to = 'items';
        }
        updateIDB({type: 'CHECK_ITEM', payload: item, from: from, to: to}, '', 'lists').then();
    };

    handleSetAction = (action) => () => {
        this.setState({action: action});
    };

    handleEditItem = item => () => {
        if (this.state.action === 'edit') {
            this.setState({open: true, edit_item: {...item}});
        }else if (this.state.action === 'delete') {
            this.handleClickRemoveItem(item);
        }
    };
    handleClickRemoveItem = item => {
        let table = item.checked ? 'done_items' : 'items';
        updateIDB({type: 'REMOVE_ITEM', payload: item}, table, 'lists').then();
    };

    handleSave = () => {
        this.setState({open: false});
        updateIDB({type: 'RENAME_ITEM', payload: this.state.edit_item}, '', 'lists').then();
    };
    handleClose = () => {
        this.setState({open: false});
    };
    handleChange = () => event => {
        let edit_item = this.state.edit_item;
        edit_item.title = event.target.value;
        this.setState({edit_item: edit_item});
    };
    handleKeyPressItem = (event) => {
        if (event.key === 'Enter' && this.state.edit_item.title !== '') {
            this.handleSave();
        }
    };

    render() {
        const { t, classes, value } = this.props;
        return <div>

            <Dialog
                fullWidth
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{t('lists.list_title')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('lists.list_title')}
                        type="text"
                        value={this.state.edit_item.title}
                        onChange={this.handleChange('edit_item')}
                        onKeyPress={this.handleKeyPressItem}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="secondary">
                        {t('lists.cancel')}
                    </Button>
                    <Button onClick={this.handleSave} color="primary">
                        {t('lists.apply')}
                    </Button>
                </DialogActions>
            </Dialog>

            <SwipeToDelete
            key={value.key}
            className={'rc-swipeout ' + classes.listItem}
            onDelete={this.handleEditItem(value)}
            onLeft={this.handleSetAction('delete')}
            onRight={this.handleSetAction('edit')}

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
                              classes={{
                                  root: value.checked ? classes.doneItems : '',
                                  primary: classes.item,
                              }}
                />
                <DragHandle />
            </ListItem>
        </SwipeToDelete>
        </div>;
    }
}

class ListItems extends React.Component {
    state = {
        fade_checked: false
    };

    handleChange = () => {
        this.setState(state => ({ fade_checked: !state.fade_checked }));
    };


    render() {
        const { t, classes, list_key } = this.props;
        const { fade_checked } = this.state;

        let items = [];
        let done_items = [];
        let lists = this.props.lists || {};
        if (Object.keys(lists).length !== 0 && lists.constructor === Object) {
            items = lists[list_key].items;
            done_items = lists[list_key].done_items;

            items = items.sort((a, b) => parseInt(a.order) - parseInt(b.order));
            items.forEach(function (item, key) {
                item['key'] = key;
            });

            done_items = done_items.sort((a, b) => parseInt(a.order) - parseInt(b.order));
            done_items.forEach(function (item, key) {
                item['key'] = key;
            });
        }

        return (
            <div>
                <SortableComponent
                    items={items}
                    list_key={list_key}
                    classes={classes}
                    t={t}
                    table='items'
                />
                <div className={classes.showDone}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={fade_checked}
                                onChange={this.handleChange}
                                color="secondary"
                            />
                        }
                        label={t('list.show_done')}
                        classes = {{ label: classes.toggleLabel, root: classes.toggleRoot }}
                    />
                </div>
                <Slide direction="up" mountOnEnter unmountOnExit in={fade_checked}>
                    <SortableComponent
                        items={done_items}
                        list_key={list_key}
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
        lists: store.lists,
        list_key: store.app.list_key,
    }
};


export default connect(mapStateToProps)(withStyles(styles)(withTranslation()(ListItems)));