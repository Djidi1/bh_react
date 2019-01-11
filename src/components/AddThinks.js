import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import AddCircle from '@material-ui/icons/AddCircle';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    textField: {
        margin: '16px 8px',
        width: 'calc(100% - 30px)'
    },
});

class AddThinks extends React.Component {
    state = {
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    render() {
        const { classes } = this.props;

        return (
                <TextField
                    id="outlined-adornment-password"
                    className={classNames(classes.margin, classes.textField)}
                    variant="outlined"
                    label="New think"
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                >
                                    {<AddCircle />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
        );
    }
}

AddThinks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddThinks);