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