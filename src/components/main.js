import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import { Link } from "react-router-dom";


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Store, Info, AccountBox, SpeakerNotes, Home } from '@material-ui/icons';


const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    avatar: {
        margin: 10,
    },
    username: {
        margin: '10px 0 0 0',
    },
    useremail: {
        margin: '0 0 10px 0',
        color: '#999999'
    },
};


class ButtonAppBar extends React.Component {
    state = {
        left: false,
        selectedIndex: 1,
    };

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index });
    };

    render() {

        const {classes} = this.props;

        const sideList = (
            <div className={classes.list}>
                <List>
                    <ListItem button key='menu_1' component={Link} to='/stores/'
                              onClick={event => this.handleListItemClick(event, 1)}
                              selected={this.state.selectedIndex === 1}>
                        <ListItemIcon><Store /></ListItemIcon>
                        <ListItemText primary='Магазины' />
                    </ListItem>
                    <ListItem button key='menu_2' component={Link} to='/requests/'
                              onClick={event => this.handleListItemClick(event, 2)}
                              selected={this.state.selectedIndex === 2}>
                        <ListItemIcon><SpeakerNotes /></ListItemIcon>
                        <ListItemText primary='Мои запросы' />
                    </ListItem>
                    <Divider />
                    <ListItem button key='menu_4' component={Link} to='/login/'
                              onClick={event => this.handleListItemClick(event, 3)}
                              selected={this.state.selectedIndex === 4}>
                        <ListItemIcon><AccountBox /></ListItemIcon>
                        <ListItemText primary='Войти' />
                    </ListItem>
                    <Divider />
                    <ListItem button key='menu_5' component={Link} to='/about/'
                              onClick={event => this.handleListItemClick(event, 4)}
                              selected={this.state.selectedIndex === 5}>
                        <ListItemIcon><Info /></ListItemIcon>
                        <ListItemText primary='О программе' />
                    </ListItem>
                </List>

            </div>
        );


        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                            onClick={this.toggleDrawer('left', true)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            {this.props.app_name}
                        </Typography>
                        <IconButton color="inherit" component={Link} to="/"><Home/></IconButton>
                    </Toolbar>
                </AppBar>
                <SwipeableDrawer
                    open={this.state.left}
                    onClose={this.toggleDrawer('left', false)}
                    onOpen={this.toggleDrawer('left', true)}
                >
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}
                    >
                        <Grid container wrap="nowrap" spacing={16}>
                            <Grid item>
                                <Avatar className={classes.avatar}>{this.props.user.name[0]}</Avatar>
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Typography className={classes.username} noWrap>{this.props.user.name}</Typography>
                                <Typography className={classes.useremail} noWrap>{this.props.user.email}</Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        {sideList}
                    </div>
                </SwipeableDrawer>
            </div>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        user: store.user,
        app_name: store.app.app_name,
    }
};

export default connect(mapStateToProps)(withStyles(styles)(ButtonAppBar));
