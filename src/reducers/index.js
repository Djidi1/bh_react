import { combineReducers } from 'redux'
import { appReducer } from './app'
import { userReducer } from './user'
import { listsReducer } from './lists'
import { backupsReducer } from './backups'

export const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    lists: listsReducer,
    backups: backupsReducer,
});