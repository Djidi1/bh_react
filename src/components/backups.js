import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import BackupIcon from '@material-ui/icons/Backup';
import CachedIcon from '@material-ui/icons/Cached';
import HistoryIcon from "@material-ui/icons/History";
import Button from "@material-ui/core/Button/Button";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

import deleteIndexedDB from "../actions/deleteIndexedDB";
import updateIDB from "./updateIndexDB";

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    toggleItem: {
        margin: 0,
    },
    button: {
        margin: '16px 0',
    },
    container: {
        padding: '0 16px',
    },
    toggleLabel: {
        margin: '0 9px',
        fontSize: 16,
    },
    formControl: {
        marginTop: 8,
        width: '100%',
    },
    select_lang: {
        height: 48,
        padding: 0,
    },
    switcher_lang: {
        marginRight: -8,
    }
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

async function getBackupsList(backend_url, token) {
    return await fetch(backend_url + '/api/backups_all', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
}


async function saveBackups(backend_url, token,lists) {
    return await fetch(backend_url + '/api/backup_save', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(lists)
    });
}

class BackupsDialog extends React.Component {
    state = {
        open: false,
        recover_open: false,
        loading: false,
        backup: {},
        error: {}
    };

    componentDidMount() {
        ( () => {
            this.setState({ language: this.props.i18n.language });
        })()
    }

    handleRefresh = () => {
        const {backend_url, token} = this.props;
        this.setState({ loading: true });
        getBackupsList(backend_url, token).then(response => response.json())
            .then(json => {
                if (json.status !== "error") {
                    updateIDB({type: 'SET_BACKUPS', payload: json}).then();
                }else{
                    this.setState({ error: json });
                }
                this.setState({ loading: false });
            })
    };

    handleSave = () => {
        const {backend_url, token, lists} = this.props;
        this.setState({ loading: true });
        saveBackups(backend_url, token, lists).then(response => response.json())
            .then(json => {
                if (json.status !== "error") {
                    console.log(json);
                    // updateIDB({type: 'SET_USER', payload: user}).then();
                }else{
                    this.setState({ error: json });
                }
                this.setState({ loading: false });
                this.handleRefresh();
            })
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleConfirmSave = () => {
        this.setState({ loading: true });
        const data = this.state.backup.data;
        const self = this;
        updateIDB({type: 'RECOVER_LISTS', payload: data}).then(function () {
            self.setState({ loading: false, recover_open: false });
        });
    };

    handleConfirmClose = () => {
        this.setState({ recover_open: false });
    };

    handleClickOpenConfirm = (item) => () => {
        this.setState({ recover_open: true, backup: item });
    };

    handleClickOpenBackups = () => {
        this.setState({ open: true });
    };



    render() {
        const { t, classes, backups, token } = this.props;
        const { open, loading } = this.state;

        let items = backups.backups !== undefined ? backups.backups : [];
        return (
            <div>
                {token
                    ?
                    <ListItem button onClick={this.handleClickOpenBackups}>
                        <ListItemIcon>
                            <BackupIcon/>
                        </ListItemIcon>
                        <ListItemText primary={t("backups.title")}/>
                    </ListItem>
                    : ''
                }
                <Dialog
                    fullWidth
                    open={this.state.recover_open}
                    onClose={this.handleConfirmClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-recover-title">{t('backups.are_you_sore')}</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {t('backups.are_you_sore_text')}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleConfirmClose} color="secondary">
                            {t('backups.no')}
                        </Button>
                        <Button onClick={this.handleConfirmSave} color="primary">
                            {t('backups.yes')}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                {t("backups.title")}
                            </Typography>
                            <IconButton
                                color="inherit"
                                onClick={this.handleRefresh}
                                aria-label="Refresh">
                                <CachedIcon
                                    className={loading ? 'rotate' : ''}
                                />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <div
                        className={classes.container}>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={this.handleSave}
                            fullWidth
                        >
                            {t("backups.save_now")}
                        </Button>
                    </div>
                    <List>
                        {items.map((item, index) => (
                            <ListItem
                                key={`backup-${index}`}
                                button
                                onClick={this.handleClickOpenConfirm(item)}>
                                <ListItemIcon>
                                    <HistoryIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t('backups.backup')} secondary={item.created_at}/>
                            </ListItem>
                        ))}
                    </List>
                </Dialog>
            </div>
        );
    }
}

BackupsDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        token: store.user.token,
        lists: store.lists,
        backups: store.backups,
        backend_url: store.app.backend_url,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        deleteIndexedDBAction: () => dispatch(deleteIndexedDB()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(BackupsDialog)));