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
import CloseIcon from '@material-ui/icons/ArrowBack';
import Slide from '@material-ui/core/Slide';
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import SettingsIcon from '@material-ui/icons/Settings';
// import DeleteIcon from "@material-ui/icons/DeleteForever";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";
import deleteIndexedDB from "../actions/deleteIndexedDB";
import hideBG from "../actions/hideBG";
import ListSubheader from "@material-ui/core/ListSubheader/ListSubheader";

const styles = {
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
    toggleItem: {
        margin: 0,
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

class SettingsDialog extends React.Component {
    state = {
        open: false,
        language: 'ru'
    };

    componentDidMount() {
        ( () => {
            this.setState({ language: this.props.i18n.language });
        })()
    }

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
        this.setState({ language: lang });
        this.props.i18n.changeLanguage(lang).then(function (res) {
            console.log(res);
        });
    };

    render() {
        const { t, classes } = this.props;
        const { open, language } = this.state;
        return (
            <div>
                <ListItem button onClick={this.handleClickOpenSettings}>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary= {t("settings.title")}/>
                </ListItem>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose} className={classes.menuButton} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                {t("settings.title")}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <List
                        subheader={<ListSubheader component="div">{t("settings.language")}</ListSubheader>}
                    >
                        <ListItem className={classes.select_lang} button onClick={() => this.handleChangeLang('ru')}>
                            <Switch
                                className={classes.switcher_lang}
                                checked={language === 'ru'}
                                color="secondary"
                            />
                            <ListItemText primary="Russian"/>
                        </ListItem>
                        <ListItem className={classes.select_lang} button onClick={() => this.handleChangeLang('en')}>
                            <Switch
                                className={classes.switcher_lang}
                                checked={language === 'en'}
                                color="secondary"
                            />
                            <ListItemText primary="English"/>
                        </ListItem>
                        <Divider />
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
                        {/*<ListItem button onClick={() => this.props.deleteIndexedDBAction()}>
                            <ListItemIcon>
                                <DeleteIcon/>
                            </ListItemIcon>
                            <ListItemText primary={t('menu.clear_db')}/>
                        </ListItem>
                        <Divider />*/}
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