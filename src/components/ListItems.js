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
});

const DragHandle = SortableHandle(() => <span><DragIndicator color={"action"}/></span>);

const SortableItem = SortableElement(({value, index, classes, removeItem}) =>
        <ListItemComponent index={index} value={value} classes={classes} removeItem={removeItem}/>
);

const SortableList = SortableContainer(({items,classes,removeItem}) => {
    return (
        <List
            dense
            disablePadding
            className={classes.root}
        >

            {items.map((item, index) => (
                <SortableItem key={`item-${index}`} classes={classes} removeItem={removeItem} index={index} value={item} />
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
            checked: [0],
        };
    }


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
                    checked={this.state.checked.indexOf(value) !== -1}
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
    constructor() {
        super();
        this.state = {
            checked: [0],
        };
    }

    render() {
        const { classes } = this.props;
        let items = this.props.items || [];
        return (
            <div>
                <SortableComponent
                    items={items}
                    classes={classes}
                    removeItem={this.props.removeItem}
                    update_items={this.props.updateItemsAction}
                />
            </div>
        );
    }
}

ListItems.propTypes = {
    classes: PropTypes.object.isRequired,
    removeItem: PropTypes.func.isRequired,
};

// приклеиваем данные из store
const mapStateToProps = store => {
    return {
        items: store.app.items.sort((a, b) => parseInt(a.order) - parseInt(b.order)).filter(() => true),
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateItemsAction: items => dispatch(updateItems(items)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListItems));