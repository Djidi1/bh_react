import React, {Component} from 'react';
import PropTypes from 'prop-types';
import connect from "react-redux/es/connect/connect";
import {withStyles} from "@material-ui/core/styles/index";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import updateItems from "../actions/updateItems";

import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.css';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';



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

const SortableItem = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({items}) => {
    return (
        <ul>
            {items.map((item, index) => (
                <SortableItem key={`item-${index}`} index={index} value={item.title} />
            ))}
        </ul>
    );
});

class SortableComponent extends Component {
    onSortEnd = ({oldIndex, newIndex}) => {
        let sorted_array =arrayMove(this.props.items, oldIndex, newIndex);
        this.props.update_items(sorted_array);
    };
    render() {
        return <SortableList items={this.props.items} onSortEnd={this.onSortEnd} />;
    }
}

class ListItems extends React.Component {
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
        const { classes } = this.props;

        let items = this.props.items || [];

        return (
            <div>
                <SortableComponent items={items} update_items={this.props.updateItemsAction}/>
                <List
                    dense
                    disablePadding
                    className={classes.root}>

                    {items.map((value, index) => (
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
        items: store.app.items,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateItemsAction: items => dispatch(updateItems(items)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListItems));