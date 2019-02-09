import React from 'react';
import PropTypes from 'prop-types';
import connect from "react-redux/es/connect/connect";
import {withTranslation} from "react-i18next";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from "@material-ui/icons/DeleteForever";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";
import deleteIndexedDB from "../actions/deleteIndexedDB";
import hideBG from "../actions/hideBG";

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    toggleItem: {
        margin: 0
    },
    toggleLabel: {
        margin: '0 9px',
        fontSize: 16
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class SettingsDialog extends React.Component {
    state = {
        open: false,
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleClickOpenSettings = () => {
        this.setState({ open: true });
    };

    handleChange = (item) => {
        this.props.hideBGAction(!item)
    };

    handleChangeLang = (lang) => {
        this.props.i18n.changeLanguage(lang);
    };

    render() {
        const { t, classes } = this.props;
        return (
            <div>
                <ListItem button onClick={this.handleClickOpenSettings}>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Settings"/>
                </ListItem>
                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                {t("settings.title")}
                            </Typography>
                            {/*<Button color="inherit" onClick={this.handleClose}>*/}
                                {/*save*/}
                            {/*</Button>*/}
                        </Toolbar>
                    </AppBar>
                    <List>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.props.app_bg}
                                    onChange= {() => this.handleChange(this.props.app_bg)}
                                    color="primary"
                                />
                            }
                            label={t('menu.beaut_bg')}
                            classes = {{ root: classes.toggleItem, label: classes.toggleLabel }}
                        />
                        <Divider />
                        <ListItem button onClick={() => this.props.deleteIndexedDBAction()}>
                            <ListItemIcon>
                                <DeleteIcon/>
                            </ListItemIcon>
                            <ListItemText primary={t('menu.clear_db')}/>
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => this.handleChangeLang('ru')}>
                            <ListItemIcon>
                                <DeleteIcon/>
                            </ListItemIcon>
                            <ListItemText primary="RU"/>
                        </ListItem>
                        <ListItem button onClick={() => this.handleChangeLang('en')}>
                            <ListItemIcon>
                                <DeleteIcon/>
                            </ListItemIcon>
                            <ListItemText primary="EN"/>
                        </ListItem>
                    </List>
                </Dialog>
            </div>
        );
    }
}

SettingsDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        app_bg: store.app.app_bg,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        deleteIndexedDBAction: () => dispatch(deleteIndexedDB()),
        hideBGAction: (item) => dispatch(hideBG(item)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(SettingsDialog)));