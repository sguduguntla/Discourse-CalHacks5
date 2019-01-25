import { combineReducers } from 'redux';
import authReducer from './authReducer';
import courseReducer from './courseReducer';
import postReducer from './postReducer';
import friendRequestReducer from './friendRequestReducer';


export default combineReducers({
    auth: authReducer,
    courses: courseReducer,
    posts: postReducer,
    friendRequests: friendRequestReducer
});