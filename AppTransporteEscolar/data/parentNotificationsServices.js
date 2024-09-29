import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/parent_notification';

export const getActiveNotifications = async(user_id) => {
    const _endpoint = `/get-active-list-by-user?user_id=${user_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getPastNotifications = async(user_id) => {
    const _endpoint = `/get-past-list-by-user?user_id=${user_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getAllPeriodOptions = async() => {
    const _endpoint = "/get-period-options";

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const createParentNotification = async(body) => {
    const _endpoint = "/create";

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const cancelParentNotification = async(id, user_id) => {
    const _endpoint = "/cancel-by-id";

    try{
        const response  = await axios.put(_controller + _endpoint, {}, {
            headers: {
                id, 
                "user-id":user_id
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};