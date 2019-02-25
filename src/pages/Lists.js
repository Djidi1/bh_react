import React from 'react';
import {connect} from 'react-redux'
import {Link} from "react-router-dom";
import {withTranslation} from "react-i18next";

import {withStyles} from '@material-ui/core/styles';
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import setListKey from "../actions/setListKey";
import AddList from "../components/AddList";
import EditList from "../components/dialogs/editList";
import DeleteList from "../components/dialogs/deleteList";
import Typography from "@material-ui/core/Typography/Typography";
import SwipeToDelete from "../swipe_js/js/main";

const styles = () => ({
    root: {
        width: '100%',
        opacity: 0.9,
    },
    child: {
        padding: '0 0 4px 16px',
    },
    item: {
        fontWeight: '300',
        fontSize: '1rem !important',
        paddingTop: 5,
    },
    inline: {
        fontWeight: '300',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width: '90%',
        whiteSpace: 'nowrap',
        color: '#999999',
        fontSize: 'small',
        marginTop: -4,
    },
    summary: {
        fontSize: '0.8rem !important',
        padding: '12px',
        color: '#7e57c2',
    },
    summary_done: {
        color: '#999999'
    },
    black: {
        color: '#666666'
    },
    edit_btn: {
        left: '4px',
        width: 52
    },
    center_buttons: {
        textAlign: 'center',
        marginTop: 16,
    },

    listItem: {
        margin: '2px 8px',
        borderRadius: '4px'
    },
});


class ListsPage extends React.Component {
    state = {
        open: false,
        open_remove: false,
        loading: false,
        edit_item: {},
        list_key: 0,
        action: '',
    };

    handleSetAction = (action) => () => {
        if (this.state.action !== action) {
            this.setState({action: action});
        }
    };

    handleEditItem = (item, index) => () => {
        if (this.state.action === 'edit') {
            this.setState({open: true, edit_item: {...item}, list_key: index});
        }else if (this.state.action === 'delete') {
            this.setState({open_remove: true, list_key: index});
        }
    };

    handleCloseEdit = (open) => {
        this.setState({open: open});
    };
    handleCloseDelete = (open) => {
        this.setState({open_remove: open});
    };

    handleToggle = (index) => () => {
        this.props.setListKey(index);
    };


    render() {
        const {t, classes, lists} = this.props;
        const {open, open_remove, edit_item, list_key} = this.state;

        return (
            <div>
                <AddList/>
                <EditList visible={open} onCloseEdit={this.handleCloseEdit} editItem={edit_item} listKey={Number(list_key)}/>
                <DeleteList visible={open_remove} onCloseDelete={this.handleCloseDelete} listKey={Number(list_key)}/>

                <List className={classes.root}>
                    {Object.keys(lists).map((index) => (
                        <SwipeToDelete
                            key={index}
                            className={'rc-swipeout ' + classes.listItem}
                            onDelete={this.handleEditItem(lists[index], index)}
                            onLeft={this.handleSetAction('delete')}
                            onRight={this.handleSetAction('edit')}

                        >
                        <ListItem
                            key={index}
                            role={undefined}
                            className={classes.child}
                            dense
                            alignItems="flex-start"
                            button
                            onClick={this.handleToggle(index)}
                            component={Link}
                            to="/list"
                        >
                            <ListItemText
                                classes={{
                                    primary: classes.item,
                                }}
                                primary={lists[index].title}
                                secondary={
                                    <React.Fragment>
                                        <Typography component="span" className={classes.inline} color="textPrimary">
                                            {lists[index].items.length ?
                                                lists[index].items.map(e => e.title).join(", ") :
                                                t('lists.no_data')
                                            }
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                            <ListItemSecondaryAction className={classes.summary}>
                                {lists[index].items.length}
                                <span className={classes.black}> / </span>
                                <span className={classes.summary_done}>{lists[index].done_items.length}</span>
                            </ListItemSecondaryAction>
                        </ListItem>
                        </SwipeToDelete>
                    ))}
                </List>
            </div>
        );
    }
}

// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        lists: store.lists,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setListKey: (index) => dispatch(setListKey(index)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(ListsPage)));
