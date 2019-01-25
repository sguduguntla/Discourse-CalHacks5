import {
    FETCH_POSTS_BY_COURSE,
    CREATE_POST,
    DELETE_POST,
    LIKE_POST
} from '../actions/types';

const INITIAL_STATE = {
    posts: [],
    message: "",
    post: null
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_POSTS_BY_COURSE:
            return { ...state,
                posts: action.payload
            };
        case CREATE_POST:
            return { ...state,
                ...action.payload,
                posts: [action.payload.post, ...state.posts]
            };
        case DELETE_POST:
            if (action.payload.deletedPostId) {
                return { ...state,
                    message: action.payload.message,
                    posts: state.posts.filter(p => p._id !== action.payload.deletedPostId)
                };
            } else {
                return { ...state, message: action.payload.message };
            }
        case LIKE_POST:
            return { ...state,
                ...action.payload
            };
        default:
            return state;
    }
}