import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddCircle from '@material-ui/icons/AddCircle';
import TextField from "@material-ui/core/TextField";


const styles = () => ({
    root: {
        width: '100%',
    },
    checkbox: {
        padding: 0,
    },
    textField: {
        margin: '16px 8px',
        width: 'calc(100% - 30px)'
    },
});

function AddThinks() {
    const classes = styles();
    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });
    const handleChange = prop => event => {
        setValues({...values, [prop]: event.target.value});
    };

    return (
        <TextField
            id="outlined-adornment-add"
            variant="outlined"
            label="Goods"
            className={classes.textField}
            fullWidth
            onChange={handleChange('amount')}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Add"
                            onClick={() => console.log('1')}
                        >
                            <AddCircle/>
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default AddThinks;