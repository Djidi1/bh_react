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
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
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

class editItemDialog extends React.Component {

    state = {
        open: false,
        edit_item: this.props.editItem,
        list_key: this.props.listKey,
        remove_open: false,
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
        updateIDB({type: 'RENAME_ITEM', payload: this.state.edit_item}, '', 'lists').then();
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

    handleConfirmDelete = () => {
        this.setState({loading: true});
        const self = this;
        updateIDB({type: 'REMOVE_LIST', payload: this.state.list_key}).then(function () {
            self.setState({loading: false, remove_open: false, open: false});
            self.props.onCloseEdit(false);
        });
    };

    handleConfirmClose = () => {
        this.setState({remove_open: false});
    };

    handleClickOpenConfirm = () => {
        this.setState({remove_open: true});
    };

    render() {
        const {t, classes} = this.props;
        const {open, edit_item, remove_open} = this.state;

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

                <Dialog
                    fullWidth
                    open={remove_open}
                    onClose={this.handleConfirmClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-delete_list">{t('lists.are_you_sore')}</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {t('lists.are_you_sore_text')}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleConfirmClose} color="secondary">
                            {t('lists.no')}
                        </Button>
                        <Button onClick={this.handleConfirmDelete} color="primary">
                            {t('lists.yes')}
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>);
    }
}

editItemDialog.propTypes = {
    onCloseEdit: PropTypes.func.isRequired,
    editItem: PropTypes.object.isRequired,
    listKey: PropTypes.number.isRequired,

};

export default (withStyles(styles)(withTranslation()(editItemDialog)));
