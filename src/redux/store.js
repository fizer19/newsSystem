//createStore创建store, combineReducers用于合并reducer
import { createStore, combineReducers } from 'redux'
//引入reducer
import { collapsedReducer } from './reducers/collapsedReducer'
import { loadingReducer } from './reducers/loadingReducer'
//由于redux存储在内存中，刷新后消失，使用redux-persist库自动保存到本地内存
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


//合并reducer
const reducer = combineReducers({
    collapsedReducer,
    loadingReducer

})

const persistConfig = {
    key: 'root',
    storage,
    //可以添加白名单(或黑名单),只缓存白名单内的reducer
    whitelist: ['collapsedReducer']
}

const persistedReducer = persistReducer(persistConfig, reducer)

let store = createStore(persistedReducer)
/**
let persistor = persistStore(store)
 * @persistor 用于刷新页面时取消过度效果，在App.js中使用到
 */
let persistor = persistStore(store)
export {
    store, persistor
}