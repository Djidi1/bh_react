import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.css';


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



class ListItems extends React.Component {
    state = {
        checked: [0],
    };

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    handleClickRemoveItem = index => () => {
        this.props.removeItem(index)
    };

    render() {
        const { classes } = this.props;

        return (
            <List
                dense
                disablePadding
                className={classes.root}>

                {this.props.items.map((value, index) => (
                    <Swipeout
                        key={index}
                        right={[
                            {
                                text: 'delete',
                                onPress: this.handleClickRemoveItem(index),
                                style: { backgroundColor: 'red', color: 'white' },
                                className: 'custom-class-2'
                            }
                        ]}
                        // onOpen={() => console.log('open')}
                        // onClose={() => console.log('close')}
                    >
                        <div style={{height: 44}}>
                            <ListItem role={undefined} dense button onClick={this.handleToggle(value)}>
                                <Checkbox
                                    className={classes.checkbox}
                                    checked={this.state.checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText primary={value.title} />
                            </ListItem>
                        </div>
                    </Swipeout>
                ))}
            </List>
        );
    }
}

ListItems.propTypes = {
    classes: PropTypes.object.isRequired,
    removeItem: PropTypes.func.isRequired,
};


export default withStyles(styles)(ListItems);