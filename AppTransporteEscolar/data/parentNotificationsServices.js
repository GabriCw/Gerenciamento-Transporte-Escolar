import axios from "axios";
import { APP_URL } from "@env";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const apiUrl = APP_URL;
const _controller = apiUrl + '/parent_notification';

export const getActiveNotifications = async(user_id, token) => {
    const _endpoint = `/get-active-list-by-user?user_id=${user_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        if(error.response.status === 500){
            await signOut(auth);
        }
        return error.response;
    }
};

export const getPastNotifications = async(user_id, token) => {
    const _endpoint = `/get-past-list-by-user?user_id=${user_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        if(error.response.status === 500){
            await signOut(auth);
        }
        return error.response;
    }
};

export const getAllPeriodOptions = async(token) => {
    const _endpoint = "/get-period-options";

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        if(error.response.status === 500){
            await signOut(auth);
        }
        return error.response;
    }
};

export const createParentNotification = async(body, token) => {
    const _endpoint = "/create";

    try{
        const response  = await axios.post(_controller + _endpoint, body, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        if(error.response.status === 500){
            await signOut(auth);
        }
        return error.response;
    }
};

export const cancelParentNotification = async(id, user_id, token) => {
    const _endpoint = "/cancel-by-id";

    try{
        const response  = await axios.put(_controller + _endpoint, {}, {
            headers: {
                id, 
                "user-id":user_id,
                "Authorization": "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        if(error.response.status === 500){
            await signOut(auth);
        }
        return error.response;
    }
};