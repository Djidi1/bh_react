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
import { AccountBox } from '@material-ui/icons';
import Avatar from "@material-ui/core/Avatar/Avatar";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";

const styles = {
    title: {
        textAlign: 'center',
    },
    text: {
        marginTop: 8,
        fontSize: 12,
        textAlign: 'center',
    }
};

class ForgotDialog extends React.Component {
    state = {
        open_login: false,
    };

    handleClickOpenLogin = () => {
        this.setState({ open_login: true });
    };

    handleClose = () => {
        this.setState({ open_login: false });
    };

    render() {
        const { t, classes } = this.props;
        return (
            <div>
                <ListItem button onClick={this.handleClickOpenLogin}>
                    <ListItemIcon>
                        <AccountBox/>
                    </ListItemIcon>
                    <ListItemText primary={t("menu.login")}/>
                </ListItem>
                <Dialog
                    open={this.state.open_login}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <Avatar className="app-sign-in-logo" />

                    <DialogTitle id="form-dialog-title" className={classes.title}>{t("sign_in.forgot_title")}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t("sign_in.email")}
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            {t("sign_in.cancel")}
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            {t("sign_in.send")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


export default withStyles(styles)(withTranslation()(ForgotDialog));