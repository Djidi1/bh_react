import React from 'react';
import { connect } from 'react-redux'
import {withStyles} from '@material-ui/core/styles';

import ListThinks from '../components/ListThinks'


const styles = {
    root: {
        flexGrow: 1,
    },
};


class HomePage extends React.Component {
    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <ListThinks />
            </div>
        );
    }
}

// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        user: store.user,
        app_name: store.app.app_name,
    }
};

export default connect(mapStateToProps)(withStyles(styles)(HomePage));