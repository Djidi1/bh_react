import React from 'react';
import {connect} from 'react-redux'
import {Link} from "react-router-dom";
import {withTranslation} from "react-i18next";

import {withStyles} from '@material-ui/core/styles';
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import setListKey from "../actions/setListKey";
import AddList from "../components/AddList";
import updateIDB from "../components/updateIndexDB";
import Typography from "@material-ui/core/Typography/Typography";


const styles = () => ({
    root: {
        width: '100%',
    },
    child: {
        position: 'relative',
        backgroundColor: '#fff !important',
        margin: 3,
        borderRadius: 6,
        opacity: 0.95,
        padding: '0 0 0 52px',
        width: 'calc(100vw - 8px)',
        minHeight: 46,
    },
    item: {
        fontWeight: '300',
        fontSize: '1rem !important',
        paddingTop: '3px'
    },
    inline: {
        fontWeight: '300',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width: '240px',
        whiteSpace: 'nowrap',
        color: '#999',
        fontSize: 'small',
    },
    summary: {
        fontSize: '0.8rem !important',
        padding: '12px',
        color: '#7e57c2',
    },
    edit_btn: {
        left: '4px',
        width: 52
    },
});


class ListsPage extends React.Component {
    state = {
        open: false,
        edit_item: {},
        list_key: 0,
    };

    handleClickOpen = (item, index) => () => {
        this.setState({open: true, edit_item: {...item}, list_key: index});
    };

    handleSave = () => {
        this.setState({open: false});
        updateIDB({
            type: 'SET_LIST_TITLE',
            payload: this.state.edit_item,
            list_key: this.state.list_key
        }, '', 'lists').then();
    };
    handleClose = () => {
        this.setState({open: false});
    };
    handleChange = () => event => {
        let edit_item = this.state.edit_item;
        edit_item.title = event.target.value;
        this.setState({edit_item: edit_item});
    };
    handleKeyPress = (event) => {
        if (event.key === 'Enter' && this.state.edit_item.title !== '') {
            this.handleSave();
        }
    };

    handleToggle = (index) => () => {
        this.props.setListKey(index);
    };

    render() {
        const {t, classes, lists} = this.props;

        return (
            <div>
                <AddList/>
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
                            onKeyPress={this.handleKeyPress}
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
                                            {lists[index].items.map(e => e.title).join(", ")}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                            <ListItemSecondaryAction className={classes.summary}>
                                {lists[index].items.length + ' / ' + lists[index].done_items.length}
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
        user: store.user,
        app_name: store.app.app_name,
        lists: store.lists,
        list_key: store.app.list_key,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setListKey: (index) => dispatch(setListKey(index)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(ListsPage)));
