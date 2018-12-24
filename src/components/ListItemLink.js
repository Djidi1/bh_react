import React from 'react';
import { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {
    active: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
};

class ListItemLink extends PureComponent {
    render() {
        const { classes, icon, title, to } = this.props;

        return (
            <ListItem button component={NavLink} to={to} activeClassName={classes.active}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
            </ListItem>
        );
    }
}

export default withStyles(styles)(ListItemLink);