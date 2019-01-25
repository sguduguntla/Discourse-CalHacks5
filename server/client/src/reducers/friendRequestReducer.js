import {
    SEND_FRIEND_REQUEST,
    GET_FRIEND_REQUEST,
    CANCEL_FRIEND_REQUEST,
    UNFRIEND,
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST,
    FETCH_FRIEND_REQUESTS,
    FETCH_FRIENDS
} from '../actions/types';

const INITIAL_STATE = {
    request: null,
    requestExists: 0, //0 = don't know, 1 = exists, 2 = doesn't exist
    message: "",
    requests: [],
    friends: []
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SEND_FRIEND_REQUEST:
            const {
                message,
                request
            } = action.payload;
            if (request) {
                return { ...state,
                    message,
                    request
                };
            } else {
                return { ...state,
                    message,
                    requestExists: 2
                };
            }
        case GET_FRIEND_REQUEST:
            if (action.payload.request) {
                return { ...state,
                    message: action.payload.message,
                    request: action.payload.request,
                    requestExists: 1
                };
            } else {
                return { ...state,
                    message: action.payload.message,
                    requestExists: 2
                };
            }
        case CANCEL_FRIEND_REQUEST:
            return { ...state,
                message: action.payload.message,
                request: null,
                requestExists: 1
            }
        case UNFRIEND:
            return { ...state,
                message: action.payload.message,
                request: null,
                requestExists: 1,
                friends: state.friends.filter(f => f._id !== action.payload.friendId)
            };
        case ACCEPT_FRIEND_REQUEST:
            if (action.payload.request) {
                return { ...state,
                    message: action.payload.message,
                    request: action.payload.request,
                    requestExists: 1,
                    requests: state.requests.filter(req => req._id !== action.payload.request._id)
                };
            } else {
                return { ...state,
                    message: action.payload.message,
                    requestExists: 2
                };
            }
        case DECLINE_FRIEND_REQUEST:
            return { ...state,
                message: action.payload.message,
                requests: state.requests.filter(req => req._id !== action.payload.request._id)
            }
        case FETCH_FRIEND_REQUESTS:
            return { ...state,
                requests: action.payload.requests,
                message: action.payload.message
            }
        case FETCH_FRIENDS:
            return { ...state,
                ...action.payload
            };
        default:
            return state;
    }
}