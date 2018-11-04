import axios from 'axios';
import {
    FETCH_USER, ENROLL
} from './types';

export const fetchUser = () => async (dispatch) => {
    const res = await axios.get('/api/current_user');

    dispatch({
        type: FETCH_USER,
        payload: res.data
    });
};

export const enrollInClass = (data, callback) => async (dispatch) => {
    axios.post('/api/new', data).then(res => {
        dispatch({
            type: ENROLL
        });
        callback(res.data)
    }).catch(e => {
        console.log(e.message)
    });
   
};