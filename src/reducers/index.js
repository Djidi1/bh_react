import { combineReducers } from 'redux'
import { appReducer } from './app'
import { userReducer } from './user'

export const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
});