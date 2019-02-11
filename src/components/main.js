import React from 'react';
import {NavLink, withRouter} from "react-router-dom";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {withTranslation} from "react-i18next";

import {withStyles} from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListIcon from '@material-ui/icons/FormatListNumbered'
import MenuIcon from '@material-ui/icons/Menu';

import ListItemLink from '../components/ListItemLink';
import SettingsDialog from '../components/settings';
import SignInDialog from './signin';


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
    constructor(props) {
        super(props);

        //Here ya go
        this.props.history.listen((location) => {
            this.setState({ pathname: location.pathname });
        });
    }

    componentDidMount() {
        ( () => {
            this.setState({ pathname: this.props.history.location.pathname });
        })()
    }

    state = {
        left: false,
        selectedIndex: 1,
        pathname: '',
    };

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };



    render() {
        const {t, classes, list_key, lists} = this.props;
        let list_title = lists[list_key].title;

        const sideList = (
            <div className={classes.list}>
                <List>
                    <SignInDialog/>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}
                    >
                        <ListItemLink title={t('menu.lists')} to='/lists/' icon={<ListIcon/>}/>
                    </div>
                    <SettingsDialog/>
                </List>
            </div>
        );

        let btnList;

        if (this.state.pathname === '/lists/' || this.state.pathname === '/') {
            list_title = 'To-Do Lists';
            btnList = <div className="app-icon" title={this.props.app_name}/>;
        } else {
            btnList = <IconButton color="inherit" component={NavLink} to="/lists/"><ListIcon/></IconButton>;
        }

        return (
            <div className={classes.root}>
                <AppBar position="sticky">
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
                            {list_title}
                        </Typography>
                        {btnList}
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
                        // onClick={this.toggleDrawer('left', false)}
                        // onKeyDown={this.toggleDrawer('left', false)}
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
        app_bg: store.app.app_bg,
        list_key: store.app.list_key,
        lists: store.lists,
    }
};


export default connect(mapStateToProps)(withTranslation()(withRouter(withStyles(styles)(ButtonAppBar))));
