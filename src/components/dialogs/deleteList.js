import React from "react";
import PropTypes from 'prop-types';
import {withTranslation} from "react-i18next";
import {withStyles} from "@material-ui/core";

import Typography from "@material-ui/core/Typography/Typography";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

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

class deleteListDialog extends React.Component {

    state = {
        list_key: this.props.listKey,
        remove_open: false,
        loading: false,
    };


    componentWillReceiveProps(nextProps, nextContent) {
        if (this.state.remove_open !== nextProps.visible) {
            this.setState({
                remove_open: nextProps.visible,
                list_key: nextProps.listKey,
            });
        }
    }

    handleConfirmDelete = () => {
        this.setState({loading: true});
        const self = this;
        updateIDB({type: 'REMOVE_LIST', payload: this.state.list_key}).then(function () {
            self.setState({loading: false, remove_open: false});
            self.props.onCloseDelete(false);
        });
    };

    handleConfirmClose = () => {
        this.setState({remove_open: false});
        this.props.onCloseDelete(false);
    };

    handleClickOpenConfirm = () => {
        this.setState({remove_open: true});
    };

    render() {
        const {t} = this.props;
        const {remove_open} = this.state;

        return (
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
        );
    }
}

deleteListDialog.propTypes = {
    onCloseDelete: PropTypes.func.isRequired,
    listKey: PropTypes.number.isRequired,

};

export default (withStyles(styles)(withTranslation()(deleteListDialog)));
