import { combineReducers } from 'redux'
import { appReducer } from './app'
import { userReducer } from './user'
import { listsReducer } from './lists'

export const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    lists: listsReducer,
});