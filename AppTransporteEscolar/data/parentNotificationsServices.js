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