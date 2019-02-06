import React from 'react';
import { connect } from 'react-redux'
import {Link} from "react-router-dom";

import {withStyles} from '@material-ui/core/styles';
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Radio from "@material-ui/core/Radio/Radio";
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
        padding: 0,
        width: 'calc(100vw - 8px)',
    },
    item: {
        fontWeight: '300',
        fontSize: '1rem !important'
    }
});


class ListsPage extends React.Component {
    state = {
        open: false,
        edit_item: {},
        prev_item: {},
        list_key: 0,
    };

    handleClickOpen = (item, index) => ()  => {
        this.setState({ open: true, edit_item: {...item}, prev_item: {...item}, list_key: index });
    };

    handleSave = () => {
        updateIDB({type: 'SET_LIST_TITLE', payload: this.state.edit_item, list_key: this.state.list_key}, '','lists').then();
        this.setState({ open: false });
    };
    handleClose = (item) => () => {
        item = this.state.prev_item;
        this.setState({ open: false });
    };
    handleChange = () => event => {
        let edit_item = this.state.edit_item;
        edit_item.title = event.target.value;
        this.setState({ edit_item: edit_item });
    };
    handleKeyPress = (event) => {
        if(event.key === 'Enter' && this.state.edit_item.title !== ''){
            this.handleSave();
        }
    };

    handleToggle = (index) => () => {

        this.props.setListKey(index);
    };

    render() {
        const {classes, lists, list_key} = this.props;

        return (
            <div>
                <AddList/>
                <Dialog
                    fullWidth
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Название</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="List title"
                            type="text"
                            value={this.state.edit_item.title}
                            onChange={this.handleChange('edit_item')}
                            onKeyPress={this.handleKeyPress}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSave} color="primary">
                            Apply
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
                            button
                            onClick={this.handleToggle(index)}
                            component={Link}
                            to="/"
                        >
                            <Radio
                                checked={Number(list_key) === Number(index)}
                                value={index}
                                name="list_keys"
                            />
                            <ListItemText
                                classes={{
                                    primary: classes.item,
                                }}
                                primary={lists[index].title}
                            />
                            <ListItemSecondaryAction>
                                <IconButton color="primary" onClick={this.handleClickOpen(lists[index], index)}>
                                    <EditIcon />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListsPage));
