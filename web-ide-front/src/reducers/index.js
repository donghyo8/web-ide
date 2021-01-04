import { combineReducers } from 'redux';
import projectReducer from './project-reducer';
import eventStateHandler from './event-state-handler';

export default combineReducers({
    project: projectReducer,
    globalEvent: eventStateHandler
});