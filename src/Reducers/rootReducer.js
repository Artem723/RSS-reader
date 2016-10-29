import {combineReducers} from 'redux';
import feed from './feed.js';
import user from './user.js';

export default combineReducers({
    feed,
    user
})