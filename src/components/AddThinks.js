import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';


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
        width: 'calc(100% - 30px)',
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: '#FFFFFF',
        },
        color: '#FFFFFF',
    },
    cssLabel: {
        '&$cssFocused': {
            color: '#FFFFFF',
        },
        color: '#FFFFFF',
    },
    cssFocused: {},
    cssDisabled: {},
    notchedOutline: {
        borderColor: '#FFFFFF !important',
    },
    cssIcon: {
        '&$cssDisabled': {
            color: '#FFFFFF42',
        },
        color: '#FFFFFF',
        marginRight: '-8px',
    }
});

class AddThinks extends React.Component {
    state = {
        new_item: ''
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickAddItem = () => {
        let new_item = {};
        new_item.title = this.state.new_item;
        // reset value
        this.setState({ new_item: '' });
        this.props.setItem(new_item);
    };
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleClickAddItem();
        }
    };

    render() {
        const { classes } = this.props;

        return (
                <TextField
                    id="outlined-adornment-item"
                    className={classNames(classes.margin, classes.textField)}
                    InputLabelProps={{
                        classes: {
                            root: classes.cssLabel,
                            focused: classes.cssFocused,
                        },
                    }}
                    variant="outlined"
                    label="New item"
                    value={this.state.new_item}
                    onChange={this.handleChange('new_item')}
                    onKeyPress={this.handleKeyPress}
                    fullWidth
                    InputProps={{
                        classes: {
                            root: classes.cssOutlinedInput,
                            focused: classes.cssFocused,
                            notchedOutline: classes.notchedOutline,
                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickAddItem}
                                    classes={{
                                        root: classes.cssIcon,
                                        disabled: classes.cssDisabled
                                    }}
                                    disabled={this.state.new_item === ''}
                                >
                                    {<SendIcon
                                    color={"inherit"}/>}
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
    setItem: PropTypes.func.isRequired,
};



export default withStyles(styles)(AddThinks);