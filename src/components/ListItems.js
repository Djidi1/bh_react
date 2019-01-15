import React, {Component} from 'react';
import PropTypes from 'prop-types';
import connect from "react-redux/es/connect/connect";
import {withStyles} from "@material-ui/core/styles/index";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import DragIndicator from '@material-ui/icons/DragIndicator';

import updateItems from "../actions/updateItems";

import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.css';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';

import Switch from '@material-ui/core/Switch';
import Grow from '@material-ui/core/Grow';


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
    listItem: {
        margin: '2px 8px',
        borderRadius: '4px'
    },
    container: {
        display: 'flex',
    },
});

const DragHandle = SortableHandle(() => <span><DragIndicator color={"action"}/></span>);

const SortableItem = SortableElement(({value, index, classes, removeItem, checkItem}) =>
        <ListItemComponent index={index} value={value} classes={classes} removeItem={removeItem} checkItem={checkItem}/>
);

const SortableList = SortableContainer(({items,classes,removeItem,checkItem}) => {
    return (
        <List
            dense
            disablePadding
            className={classes.root}
        >

            {items.map((item, index) => (
                <SortableItem key={`item-${index}`} classes={classes} removeItem={removeItem} checkItem={checkItem} index={index} value={item} />
            ))}
        </List>
    );
});

class SortableComponent extends Component {
    onSortEnd = ({oldIndex, newIndex}) => {
        let sorted_array = arrayMove(this.props.items, oldIndex, newIndex);
        sorted_array.forEach(function(item, index){
            item.order = index;
        });
        this.props.update_items(sorted_array);
    };
    render() {
        return <SortableList
            removeItem={this.props.removeItem}
            checkItem={this.props.checkItem}
            classes={this.props.classes}
            items={this.props.items}
            onSortEnd={this.onSortEnd}
            lockAxis={'y'}
            useDragHandle
            lockToContainerEdges={true}
        />;
    }
}

class ListItemComponent extends Component {
    constructor() {
        super();
        this.state = {
            checked: false,
        };
    }

    componentDidMount() {
        this.setState({
            checked: this.props.value.checked || false
        });
    }

    handleToggle = value => () => {
        this.setState({
            checked: value.checked,
        });

        this.props.checkItem(value)
    };

    handleClickRemoveItem = index => () => {
        this.props.removeItem(index)
    };

    render() {
        const { classes, index, value } = this.props;
        return <Swipeout
            key={index}
            className={'rc-swipeout ' + classes.listItem}
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
            <ListItem
                role={undefined}
                disableRipple
                dense
                button
                onClick={this.handleToggle(value)}>
                <Checkbox
                    className={classes.checkbox}
                    checked={this.state.checked}
                    tabIndex={-1}
                    disableRipple
                />
                <ListItemText primary={value.title} />
                <DragHandle />
            </ListItem>
        </Swipeout>;
    }
}

class ListItems extends React.Component {
    state = {
        checked: false,
    };

    handleChange = () => {
        this.setState(state => ({ checked: !state.checked }));
    };

    render() {
        const { classes } = this.props;
        const { checked } = this.state;

        let items = this.props.items || [];
        let checked_items = this.props.checked_items || [];

        const polygon = (
            <SortableComponent
                items={checked_items}
                classes={classes}
                removeItem={this.props.removeItem}
                checkItem={this.props.checkItem}
                update_items={this.props.updateItemsAction}
            />
        );

        return (
            <div>
                <SortableComponent
                    items={items}
                    classes={classes}
                    removeItem={this.props.removeItem}
                    checkItem={this.props.checkItem}
                    update_items={this.props.updateItemsAction}
                />
                <Switch checked={checked} onChange={this.handleChange} aria-label="Collapse" />
                <div className={classes.container}>
                    <Grow in={checked}>{polygon}</Grow>
                </div>

            </div>
        );
    }
}

ListItems.propTypes = {
    classes: PropTypes.object.isRequired,
    removeItem: PropTypes.func.isRequired,
    checkItem: PropTypes.func.isRequired,
};

// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        items: store.app.items.sort((a, b) => parseInt(a.order) - parseInt(b.order)).filter(x => !x.checked),
        checked_items: store.app.items.sort((a, b) => parseInt(a.order) - parseInt(b.order)).filter(x => x.checked),
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateItemsAction: items => dispatch(updateItems(items)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListItems));