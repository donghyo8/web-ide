import { SET_EVENT_STATE } from '../actions';

const init_state = { eventType: null, additional: null }

function eventStateHandler (state=init_state, action) {
    switch(action.type) {
        case SET_EVENT_STATE:
            return { eventType: action.eventType, additional: action.additional }
        default: break;
    }
    return state;
}

export default eventStateHandler;