import React from 'react';
import {connect} from "react-redux";
import {withStyles} from "@material-ui/styles";

import {withTranslation} from "react-i18next";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from "@material-ui/core/Avatar/Avatar";
import Typography from "@material-ui/core/Typography/Typography";

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

async function sign_on(backend_url, username, email, password) {
    return await fetch(backend_url + '/api/auth/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: username,
            email: email,
            password: password,
        })
    });
}

class SignOnDialog extends React.Component {
    state = {
        open_login: false,
        error: '',
        username: '',
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

    handleSignOn = () => {
        const {backend_url} = this.props;
        const {username, email, password} = this.state;
        sign_on(backend_url, username, email, password).then(response => response.json())
            .then(json => {
                if (json.errors) {
                    this.setState({ error: json.message });
                }else{
                    this.setState({ open_login: false });
                }
            })

    };

    render() {
        const { t, classes } = this.props;
        const { open_login, error } = this.state;
        return (
            <div className={classes.center}>
                <Button
                    color="secondary"
                    className={classes.button}
                    onClick={this.handleClickOpenLogin}
                    fullWidth
                >
                    {t("sign_in.sign_on")}
                </Button>
                <Dialog
                    open={open_login}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    scroll={'body'}
                >
                    <Avatar className="app-sign-in-logo" />

                    <DialogTitle id="form-dialog-title" className={classes.center}>{t("sign_in.sign_on_title")}</DialogTitle>
                    <Typography className={classes.error}>
                        {error}
                    </Typography>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t("sign_in.username")}
                            onChange={this.handleChange('username')}
                            type="text"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label={t("sign_in.email")}
                            onChange={this.handleChange('email')}
                            type="email"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label={t("sign_in.password")}
                            onChange={this.handleChange('password')}
                            type="password"
                            fullWidth
                        />
                        <div className={classes.center_buttons}>
                            <Button
                                variant="contained"
                                onClick={this.handleSignOn}
                                color="primary"
                                disabled={this.state.email === ''}
                                fullWidth
                            >
                                {t("sign_in.sign_on")}
                            </Button>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            {t("sign_in.cancel")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        backend_url: store.app.backend_url,
    }
};

export default connect(mapStateToProps)(withStyles(styles)(withTranslation()(SignOnDialog)));