import React from 'react';

import updateIDB from './updateIndexDB';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import AppBar from "@material-ui/core/AppBar/AppBar";


const styles = theme => ({
    typography: {
        useNextVariants: true,
    },
    subAppBar: {
        backgroundColor: '#5C6BC0',
        marginBottom: 5,
        opacity: 0.9
    },
    title: {
        color: '#FFFFFF',
        padding: '8px 8px 0',
        textAlign: 'center'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    textField: {
        margin: '8px',
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
        let lists = 'lists';
        let list_key = 0;
        let new_item = {};
        new_item.title = this.state.new_item;
        new_item.checked = false;
        // reset value
        this.setState({ new_item: '' });
        updateIDB({type: 'SET_ITEM', payload: new_item}, 'items', lists, list_key).then();
    };
    handleKeyPress = (event) => {
        if(event.key === 'Enter' && this.state.new_item !== ''){
            this.handleClickAddItem();
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <AppBar position="sticky" classes={{root: classes.subAppBar}}>
                <TextField
                    id="outlined-adornment-item"
                    className={classNames(classes.margin, classes.textField)}
                    margin="dense"
                    autoComplete={'off'}
                    InputLabelProps={{
                        classes: {
                            root: classes.cssLabel,
                            focused: classes.cssFocused,
                        },
                    }}
                    variant="outlined"
                    label="Добавить что-то..."
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
            </AppBar>
        );
    }
}

AddThinks.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(AddThinks);