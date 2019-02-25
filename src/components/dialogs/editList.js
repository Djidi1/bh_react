import React from "react";
import PropTypes from 'prop-types';
import {withTranslation} from "react-i18next";
import {withStyles} from "@material-ui/core";

import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Typography from "@material-ui/core/Typography/Typography";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import Dialog from "@material-ui/core/Dialog/Dialog";
import CloseIcon from "@material-ui/icons/ArrowBack";
import DoneIcon from '@material-ui/icons/Done';
import Slide from "@material-ui/core/Slide/Slide";

import updateIDB from "../updateIndexDB";

const styles = () => ({
    appBar: {
        position: 'relative',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    flex: {
        flex: 1,
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class editListDialog extends React.Component {

    state = {
        open: false,
        edit_item: this.props.editItem,
        list_key: this.props.listKey,
        loading: false,
    };


    componentWillReceiveProps(nextProps, nextContent) {
        if (this.state.open !== nextProps.visible) {
            this.setState({
                open: nextProps.visible,
                edit_item: nextProps.editItem,
                list_key: nextProps.listKey,
            });
        }
    }


    handleChange = () => event => {
        let edit_item = this.state.edit_item;
        edit_item.title = event.target.value;
        this.setState({edit_item: edit_item});
    };

    handleSave = () => {
        this.setState({open: false});
        this.props.onCloseEdit(false);
        updateIDB({
            type: 'SET_LIST_TITLE',
            payload: this.state.edit_item,
            list_key: this.state.list_key
        }, '', 'lists').then();
    };
    handleClose = () => {
        this.setState({open: false});
        this.props.onCloseEdit(false);
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter' && this.state.edit_item.title !== '') {
            this.handleSave();
        }
    };

    render() {
        const {t, classes} = this.props;
        const {open, edit_item} = this.state;

        return (
            <div>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose} className={classes.menuButton}
                                        aria-label="Close">
                                <CloseIcon/>
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                {t('lists.list_edit')}
                            </Typography>
                            <IconButton color="inherit" onClick={this.handleSave}>
                                <DoneIcon/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label={t('lists.list_title')}
                            type="text"
                            value={edit_item !== undefined ? edit_item.title : ''}
                            onChange={this.handleChange()}
                            onKeyPress={this.handleKeyPress}
                            fullWidth
                        />
                    </DialogContent>
                </Dialog>

            </div>);
    }
}

editListDialog.propTypes = {
    onCloseEdit: PropTypes.func.isRequired,
    editItem: PropTypes.object.isRequired,
    listKey: PropTypes.number.isRequired,

};

export default (withStyles(styles)(withTranslation()(editListDialog)));
