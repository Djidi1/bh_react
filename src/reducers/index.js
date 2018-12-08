import { combineReducers } from 'redux'
import { appReducer } from './app'
import { userReducer } from './user'
import { userCarsReducer } from './user_cars'
import { storesReducer } from './stores'
import { ordersReducer } from './orders'
import { messagesReducer } from './messages'
import { attachesReducer } from './attaches'

export const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    userCars: userCarsReducer,
    stores: storesReducer,
    orders: ordersReducer,
    messages: messagesReducer,
    attaches: attachesReducer,
});