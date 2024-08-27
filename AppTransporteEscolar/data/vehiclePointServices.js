import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/vehicle-point';

export const getAssociationsByUser = async(id) => {
    const _endpoint = `/get-association-by-user?user_id=${id}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updateAssociation = async(body) => {
    const _endpoint = `/update`;

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
}; 

export const deleteAssociation = async(id) => {
    const _endpoint = `/delete?vehicle_point_id=${id}`;

    try{
        const response  = await axios.delete(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
}; 