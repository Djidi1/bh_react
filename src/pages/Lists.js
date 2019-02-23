import React from 'react';
import {connect} from 'react-redux'
import {Link} from "react-router-dom";
import {withTranslation} from "react-i18next";

import {withStyles} from '@material-ui/core/styles';
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import setListKey from "../actions/setListKey";
import AddList from "../components/AddList";
import EditList from "../components/dialogs/editList";
import Typography from "@material-ui/core/Typography/Typography";

const styles = () => ({
    root: {
        width: '100%',
    },
    child: {
        position: 'relative',
        backgroundColor: '#fff !important',
        margin: '3px 5px',
        borderRadius: 6,
        opacity: 0.9,
        padding: '0 0 0 52px',
        width: 'calc(100vw - 10px)',
        minHeight: 46,
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
});


class ListsPage extends React.Component {
    state = {
        open: false,
        loading: false,
        edit_item: {},
        list_key: 0,
    };

    handleCloseEdit = (open) => {
        this.setState({open: open});
    };

    handleClickOpen = (item, index) => () => {
        this.setState({open: true, edit_item: {...item}, list_key: index});
    };

    handleToggle = (index) => () => {
        this.props.setListKey(index);
    };


    render() {
        const {t, classes, lists} = this.props;
        const {open, edit_item, list_key} = this.state;

        return (
            <div>
                <AddList/>
                <EditList visible={open} onCloseEdit={this.handleCloseEdit} editItem={edit_item} listKey={Number(list_key)}/>

                <List className={classes.root}>
                    {Object.keys(lists).map((index) => (
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

                            <ListItemSecondaryAction className={classes.edit_btn}>
                                <IconButton color="primary" onClick={this.handleClickOpen(lists[index], index)}>
                                    <EditIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
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
