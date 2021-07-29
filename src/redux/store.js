import {createStore, combineReducers} from 'redux'

import {collapsedReducer} from './reducers/collapsedReducer'
import {loadingReducer} from './reducers/loadingReducer'
//合并reducer
const reducer = combineReducers({
    collapsedReducer,
    loadingReducer

})

export default createStore(reducer)