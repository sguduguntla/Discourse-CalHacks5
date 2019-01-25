import {
    FETCH_CURRENT_USER,
    FETCH_USER,
    FETCH_ALL_USERS,
    UPDATE_USER,
    ENROLL,
    UNENROLL
} from '../actions/types';

const INITIAL_STATE = {
    user: null,
    otherUser: null,
    message: "",
    allUsers: []
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_CURRENT_USER:
            return { ...state,
                ...action.payload
            };
        case FETCH_USER:
            const { user, message } = action.payload;
            return { ...state,
                otherUser: user, message
            };
        case FETCH_ALL_USERS:
            return { ...state, allUsers: action.payload }
        case UPDATE_USER:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}