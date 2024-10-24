import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/schedule';

export const getHistoricDriverByDate = async(body) => {
    const _endpoint = "/get-driver-historic-by-date";
    
    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getHistoricDriverDetail = async(scheduleId, userId) => {
    const _endpoint = "/get-driver-historic-details";
    
    try{
        const headerBody = {
            'schedule-id': scheduleId,
            'user-id': userId
        };
        
        const response = await axios.get(_controller + _endpoint, {
            headers: headerBody
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getCurrentSchedules = async(user_id) => {
    const endpoint = `/get-current-schedules-by-driver?user_id=${user_id}`;

    try{
        const response = await axios.get(_controller + endpoint);
        return response;
    }
    catch(error){
        return error.response;
    }
};

    
