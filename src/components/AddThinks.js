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
        new_item: ''
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleClickAddItem = () => {
        console.log(this.state.new_item);
        let new_item = {};
        new_item.title = this.state.new_item;
        this.props.setItem(new_item)
    };

    render() {
        const { classes } = this.props;

        return (
                <TextField
                    id="outlined-adornment-password"
                    className={classNames(classes.margin, classes.textField)}
                    variant="outlined"
                    label="New item"
                    value={this.state.password}
                    onChange={this.handleChange('new_item')}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickAddItem}
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
    setItem: PropTypes.func.isRequired,
};



export default withStyles(styles)(AddThinks);