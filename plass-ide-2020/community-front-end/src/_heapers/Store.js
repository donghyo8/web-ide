import thunk from 'redux-thunk'
import { createStore,combineReducers, applyMiddleware } from 'redux';
import UserReducer from '../_reducers/UserReducer';
// import logger from 'redux-logger'
const allRedecers = combineReducers({
    user : UserReducer,
});
var myStore = createStore(
    allRedecers,
    applyMiddleware(
        thunk
    )
);
export default myStore;