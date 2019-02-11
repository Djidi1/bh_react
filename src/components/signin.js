import React from 'react';
import {withStyles} from "@material-ui/styles";

import {withTranslation} from "react-i18next";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {AccountBox, ExitToApp} from '@material-ui/icons';
import Avatar from "@material-ui/core/Avatar/Avatar";
import Typography from "@material-ui/core/Typography/Typography";
import SignOnDialog from './signon'
import updateIDB from "./updateIndexDB";
import connect from "react-redux/es/connect/connect";

const styles = {
    center: {
        textAlign: 'center',
    },
    center_buttons: {
        textAlign: 'center',
        marginTop: 16,
    },
    text: {
        marginTop: 8,
        fontSize: 12,
        textAlign: 'center',
    },
    error: {
        color: '#F44336',
        margin: '0 24px'
    }
};

async function sign_in(email, password) {
    return await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    });
}

class SignInDialog extends React.Component {
    state = {
        open_login: false,
        open_confirm: false,
        error: '',
        email: '',
        password: ''
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickOpenLogin = () => {
        this.setState({ open_login: true });
    };

    handleClose = () => {
        this.setState({ open_login: false });
    };

    handleClickLogout = () => {
        this.setState({ open_confirm: true });
    };

    handleCancel = () => {
        this.setState({ open_confirm: false });
    };

    handleOk = () => {
        updateIDB({type: 'SET_USER', payload: {"name": 'Anonymous', "email": "-"}}).then();
        this.setState({ open_confirm: false });
    };

    handleSignIn = () => {
        const {email, password} = this.state;
        sign_in(email, password).then(response => response.json())
            .then(json => {
                console.log(json);
                if (json.status !== "error") {
                    let user = json.user;
                    user['token'] = json.token;
                    updateIDB({type: 'SET_USER', payload: user}).then();
                    this.setState({ open_login: false });
                }else{
                    this.setState({ error: json.msg });
                }
            })

    };
    render() {
        const { t, classes, user } = this.props;
        const { open_login, open_confirm, error } = this.state;
        return (
            <div>
                {user.token
                    ? <ListItem button onClick={this.handleClickLogout}>
                        <ListItemIcon>
                            <ExitToApp/>
                        </ListItemIcon>
                        <ListItemText primary={t("menu.logout")}/>
                    </ListItem>
                    :
                    <ListItem button onClick={this.handleClickOpenLogin}>
                        <ListItemIcon>
                            <AccountBox/>
                        </ListItemIcon>
                        <ListItemText primary={t("menu.login")}/>
                    </ListItem>
                }
                <Dialog
                    open={open_login}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <Avatar className="app-sign-in-logo" />

                    <DialogTitle id="form-dialog-title" className={classes.center}>{t("sign_in.title")}</DialogTitle>
                    <Typography className={classes.error}>
                        {error}
                    </Typography>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t("sign_in.email")}
                            type="email"
                            onChange={this.handleChange('email')}
                            fullWidth
                        />

                        <TextField
                            margin="dense"
                            label={t("sign_in.password")}
                            type="password"
                            onChange={this.handleChange('password')}
                            fullWidth
                        />

                        <div className={classes.center_buttons}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleSignIn}
                                fullWidth
                                disabled={this.state.email === ''}
                            >
                                {t("sign_in.sign_in")}
                            </Button>
                            <Typography>
                                {t("sign_in.or")}
                            </Typography>
                            <SignOnDialog/>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            {t("sign_in.cancel")}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={open_confirm}
                    fullWidth
                    disableBackdropClick
                    disableEscapeKeyDown
                    aria-labelledby="confirmation-dialog-title"
                >
                    <DialogTitle id="confirmation-dialog-title">{t("sign_in.confirmation")}</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {t("sign_in.are_you_sore")}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="secondary">
                            {t("sign_in.cancel")}
                        </Button>
                        <Button onClick={this.handleOk} color="primary">
                            {t("sign_in.ok")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        user: store.user,
    }
};

export default connect(mapStateToProps)(withStyles(styles)(withTranslation()(SignInDialog)));