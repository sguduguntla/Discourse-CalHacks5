import axios from 'axios';
import {
    FETCH_CURRENT_USER,
    FETCH_USER,
    FETCH_ALL_USERS,
    UPDATE_USER,
    ENROLL,
    UNENROLL,
    FETCH_COURSE,
    FETCH_COURSES,
    CREATE_COURSE,
    FETCH_POSTS_BY_COURSE,
    CREATE_POST,
    DELETE_POST,
    LIKE_POST,
    FETCH_STUDENTS_IN_COURSE,
    SEND_FRIEND_REQUEST,
    GET_FRIEND_REQUEST,
    CANCEL_FRIEND_REQUEST,
    UNFRIEND,
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST,
    FETCH_FRIEND_REQUESTS,
    FETCH_FRIENDS
} from './types';

export const fetchCurrentUser = () => async (dispatch) => {
    const res = await axios.get('/api/current_user');

    dispatch({
        type: FETCH_CURRENT_USER,
        payload: res.data
    });
};

export const fetchUser = (userId) => async (dispatch) => {
    const res = await axios.get(`/api/users/${userId}`);

    dispatch({
        type: FETCH_USER,
        payload: res.data
    });
};

export const fetchAllUsers = (userId) => async (dispatch) => {
    const res = await axios.get(`/api/users/`);

    dispatch({
        type: FETCH_ALL_USERS,
        payload: res.data
    });
};

export const updateUser = (userId, userInfo) => async (dispatch) => {
    const res = await axios.put(`/api/users/update?id=${userId}`, userInfo);

    dispatch({
        type: UPDATE_USER,
        payload: res.data
    });
};

export const enrollInCourse = (classKey, userId) => async (dispatch) => {
    const res = await axios.patch('/api/courses/', {
        classKey,
        userId
    });

    dispatch({
        type: ENROLL,
        payload: res.data
    });
};

export const unenrollFromCourse = (userId, courseId) => async (dispatch) => {
    const res = await axios.patch(`/api/courses/${courseId}/unenroll?userId=${userId}`);

    dispatch({
        type: UNENROLL,
        payload: res.data
    });
};

export const fetchCourse = (id) => async (dispatch) => {
    const res = await axios.get(`/api/courses/${id}`);

    dispatch({
        type: FETCH_COURSE,
        payload: res.data
    });
};

export const fetchCourses = (ids) => async (dispatch) => {
    const res = await axios.post(`/api/courses/`, {
        ids
    });

    dispatch({
        type: FETCH_COURSES,
        payload: res.data
    });
}

export const createCourse = (courseInfo) => async (dispatch) => {
    const res = await axios.post(`/api/courses/new`, courseInfo);

    dispatch({
        type: CREATE_COURSE,
        payload: res.data.message
    });
}

export const fetchPostsByCourse = (courseId) => async (dispatch) => {
    const res = await axios.get(`/api/posts?courseId=${courseId}`);

    dispatch({
        type: FETCH_POSTS_BY_COURSE,
        payload: res.data
    });
}

export const createPost = (postInfo) => async (dispatch) => {
    const res = await axios.post("/api/posts/new", postInfo);

    dispatch({
        type: CREATE_POST,
        payload: res.data
    });
}

export const deletePost = (authorId, postId) => async (dispatch) => {
    const res = await axios.delete(`/api/posts/delete/${postId}?authorId=${authorId}`);

    dispatch({
        type: DELETE_POST,
        payload: res.data
    });
};

export const likePost = ({
    postId,
    userId,
    liked
}) => async (dispatch) => {
    const res = await axios.post(`/api/posts/${postId}/like`, {
        userId,
        liked
    });

    dispatch({
        type: LIKE_POST,
        payload: res.data
    });
}

export const fetchStudentsInCourse = (courseId) => async (dispatch) => {
    const res = await axios.get(`/api/courses/${courseId}/students`);

    dispatch({
        type: FETCH_STUDENTS_IN_COURSE,
        payload: res.data
    });
}

export const sendFriendRequest = (senderId, recipientId) => async (dispatch) => {
    const res = await axios.post(`/api/friends/new`, {
        senderId,
        recipientId
    });

    dispatch({
        type: SEND_FRIEND_REQUEST,
        payload: res.data
    });
}

export const getFriendRequest = (user1Id, user2Id) => async (dispatch) => {
    const res = await axios.get(`/api/friends/request?user1Id=${user1Id}&user2Id=${user2Id}`);

    dispatch({
        type: GET_FRIEND_REQUEST,
        payload: res.data
    });
}

export const cancelFriendRequest = (senderId, recipientId) => async (dispatch) => {
    const res = await axios.delete(`/api/friends/request/delete?senderId=${senderId}&recipientId=${recipientId}`);

    dispatch({
        type: CANCEL_FRIEND_REQUEST,
        payload: res.data
    });
}

export const unfriend = (senderId, recipientId) => async (dispatch) => {
    const res = await axios.delete(`/api/friends/delete?senderId=${senderId}&recipientId=${recipientId}`);

    dispatch({
        type: UNFRIEND,
        payload: res.data
    });
};

export const acceptFriendRequest = (senderId, recipientId) => async (dispatch) => {
    const res = await axios.post(`/api/friends/request/accept?senderId=${senderId}&recipientId=${recipientId}`);

    dispatch({
        type: ACCEPT_FRIEND_REQUEST,
        payload: res.data
    });
};

export const declineFriendRequest = (senderId, recipientId) => async (dispatch) => {
    const res = await axios.delete(`/api/friends/request/decline?senderId=${senderId}&recipientId=${recipientId}`);

    dispatch({
        type: DECLINE_FRIEND_REQUEST,
        payload: res.data
    });
};

export const fetchFriendRequests = (userId, isRecipient) => async (dispatch) => {
    const res = await axios.get(`/api/friends/requests?${isRecipient ? 'recipient' : 'sender'}Id=${userId}`);

    dispatch({
        type: FETCH_FRIEND_REQUESTS,
        payload: res.data
    });
};

export const fetchFriends = (userId) => async (dispatch) => {
    const res = await axios.get(`/api/friends?userId=${userId}`);

    dispatch({
        type: FETCH_FRIENDS,
        payload: res.data
    });
};