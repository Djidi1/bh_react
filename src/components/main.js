import React from 'react';
import {NavLink, withRouter} from "react-router-dom";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import Switch from "@material-ui/core/Switch/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Store, Info, AccountBox } from '@material-ui/icons';
import ListIcon from '@material-ui/icons/FormatListNumbered'
import MenuIcon from '@material-ui/icons/Menu';

import ListItemLink from '../components/ListItemLink';
import deleteIndexedDB from "../actions/deleteIndexedDB";
import hideBG from "../actions/hideBG";


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
    toggleItem: {
        margin: 0
    },
    toggleLabel: {
        margin: '0 9px',
        fontSize: 16
    },
};


class ButtonAppBar extends React.Component {
    constructor(props) {
        super(props);

        //Here ya go
        this.props.history.listen((location) => {
            console.log(location.pathname);
            this.setState({ pathname: location.pathname });
        });
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

    handleChange = (item) => {
        this.props.hideBGAction(!item)
    };

    render() {

        const {classes, list_key, lists} = this.props;

        const list_title = lists[list_key].title;

        const sideList = (
            <div className={classes.list}>
                <List>
                    <ListItemLink title='Главная' to='/' icon={<Store/>}/>
                    <ListItemLink title='Списки' to='/lists/' icon={<ListIcon/>}/>
                    <ListItemLink title='Вход' to='/login/' icon={<AccountBox/>}/>
                    <Divider />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.props.app_bg}
                                onChange= {() => this.handleChange(this.props.app_bg)}
                                color="primary"
                            />
                        }
                        label="Красивый фон"
                        classes = {{ root: classes.toggleItem, label: classes.toggleLabel }}
                    />
                    <Divider />
                    <ListItem button onClick={() => this.props.deleteIndexedDBAction()}>
                        <ListItemIcon>
                            <DeleteIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Очистить БД"/>
                    </ListItem>
                    <Divider />
                    <ListItemLink title='О программе' to='/about/' icon={<Info/>}/>
                </List>

            </div>
        );

        let btnList;

        if (this.state.pathname === '/lists/') {
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
        app_bg: store.app.app_bg,
        list_key: store.app.list_key,
        lists: store.lists,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        deleteIndexedDBAction: () => dispatch(deleteIndexedDB()),
        hideBGAction: (item) => dispatch(hideBG(item)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(ButtonAppBar)));
