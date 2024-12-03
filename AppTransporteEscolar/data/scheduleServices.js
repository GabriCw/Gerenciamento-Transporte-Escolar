import axios from "axios";
import { APP_URL } from "@env";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const apiUrl = APP_URL;
const _controller = apiUrl + '/schedule';

export const getHistoricDriverByDate = async(body, token) => {
    const _endpoint = "/get-driver-historic-by-date";
    
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

export const getHistoricResponsibleByDate = async(body, token) => {
    const _endpoint = "/get-responsible-historic-by-date";
    
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

export const getHistoricResponsibleDetail = async(scheduleId, userId, pointId, token) => {
    const _endpoint = "/get-responsible-historic-details";
    
    try{
        const headerBody = {
            'schedule-id': scheduleId,
            'user-id': userId,
            'point-id': pointId,
            "Authorization": "Bearer " + token
        };

        console.log(headerBody)
        
        const response = await axios.get(_controller + _endpoint, {
            headers: headerBody
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

export const getHistoricDriverDetail = async(scheduleId, userId, token) => {
    const _endpoint = "/get-driver-historic-details";
    
    try{
        const headerBody = {
            'schedule-id': scheduleId,
            'user-id': userId,
            "Authorization": "Bearer " + token
        };
        
        const response = await axios.get(_controller + _endpoint, {
            headers: headerBody
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

export const getCurrentSchedules = async(user_id, token) => {
    const endpoint = `/get-current-schedules-by-driver?user_id=${user_id}`;

    try{
        const response = await axios.get(_controller + endpoint, {
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

    
