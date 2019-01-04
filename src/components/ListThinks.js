import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.css';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    checkbox: {
        padding: 0,
    }
});

class ListThinks extends React.Component {
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

    render() {
        const { classes } = this.props;

        return (
            <List
                dense
                disablePadding
                className={classes.root}>

                {[0, 1, 2, 3].map(value => (
                    <Swipeout
                        key={value}
                        right={[
                            {
                                text: 'delete',
                                onPress:() => console.log('delete'),
                                style: { backgroundColor: 'red', color: 'white' },
                                className: 'custom-class-2'
                            }
                        ]}
                        onOpen={() => console.log('open')}
                        onClose={() => console.log('close')}
                    >
                        <div style={{height: 44}}>
                            <ListItem role={undefined} dense button onClick={this.handleToggle(value)}>
                                <Checkbox
                                    className={classes.checkbox}
                                    checked={this.state.checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText primary={`Line item ${value + 1}`} />
                            </ListItem>
                        </div>
                    </Swipeout>
                ))}
            </List>
        );
    }
}

ListThinks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListThinks);