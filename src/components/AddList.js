import React from 'react';
import {withTranslation} from "react-i18next";

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
    subAppBar: {
        backgroundColor: '#7e57c2',
        opacity: 0.8
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
    cssFocused: {
        caretColor: '#FFFFFF'
    },
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

class AddList extends React.Component {
    state = {
        new_list: ''
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickAddList = () => {
        let new_list = {};
        new_list.title = this.state.new_list;
        new_list.items = [];
        new_list.done_items = [];
        updateIDB({type: 'SET_LIST', payload: new_list}).then();
        // reset value
        this.setState({ new_list: '' });
    };
    handleKeyPress = (event) => {
        if(event.key === 'Enter' && this.state.new_item !== ''){
            this.handleClickAddList();
        }
    };

    render() {
        const { t, classes } = this.props;

        return (
            <AppBar position="sticky" classes={{root: classes.subAppBar}}>
                <TextField
                    id="outlined-adornment-list"
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
                    label={t('lists.create_list')}
                    value={this.state.new_list}
                    onChange={this.handleChange('new_list')}
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
                                    onClick={this.handleClickAddList}
                                    classes={{
                                        root: classes.cssIcon,
                                        disabled: classes.cssDisabled
                                    }}
                                    disabled={this.state.new_list === ''}
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

AddList.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(withTranslation()(AddList));