import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/vehicle';

export const getVehicleByUser = async(id) => {
    const _endpoint = `/get-list-by-driver?user_id=${id}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updateVehicle = async(body) => {
    const _endpoint = '/update';

    try{
        const response  = await axios.put(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};