import React from 'react';
import { connect } from 'react-redux'
import {withStyles} from '@material-ui/core/styles';
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Radio from "@material-ui/core/Radio/Radio";
import setListKey from "../actions/setListKey";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";



const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});


class ListsPage extends React.Component {
    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleToggle = (index) => () => {
        this.props.setListKey(index);
    };

    render() {
        const {classes, lists, list_key} = this.props;

        return (
            <div>
                Списки покупок
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Open form dialog
            </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send
                            updates occasionally.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Subscribe
                        </Button>
                    </DialogActions>
                </Dialog>
                <List className={classes.root}>
                    {Object.keys(lists).map((index) => (
                        <ListItem key={index} role={undefined} dense button onClick={this.handleToggle(index)}>
                            <ListItemText primary={lists[index].title} />
                            <Radio
                                checked={Number(list_key) === Number(index)}
                                value={index}
                                name="list_keys"
                            />
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
