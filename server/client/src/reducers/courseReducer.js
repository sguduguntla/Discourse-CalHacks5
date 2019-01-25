import {
    FETCH_COURSE,
    FETCH_COURSES,
    CREATE_COURSE,
    FETCH_STUDENTS_IN_COURSE,
    ENROLL,
    UNENROLL
} from '../actions/types';

const INITIAL_STATE = {
    myCourses: [],
    message: "",
    course: null,
    students: []
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_COURSE:
            return { ...state,
                course: action.payload
            };
        case FETCH_COURSES:
            return { ...state,
                myCourses: action.payload
            };
        case CREATE_COURSE:
            return { ...state,
                message: action.payload
            };
        case FETCH_STUDENTS_IN_COURSE:
            return { ...state,
                students: action.payload
            };
        case ENROLL:
            if (action.payload.course) {
                return { ...state,
                    message: action.payload.message,
                    myCourses: [...state.myCourses, action.payload.course]
                };
            } else {
                return { ...state,
                    message: action.payload.message
                };
            }
        case UNENROLL:
            return { ...state,
                message: action.payload.message,
                myCourses: state.myCourses.filter(c => c._id != action.payload.courseId)
            };
        default:
            return state;
    }
}