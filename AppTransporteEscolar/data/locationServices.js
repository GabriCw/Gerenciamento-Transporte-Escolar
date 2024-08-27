import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/coordinate';


export const postDriverLocation = async(body) => {
    const _endpoint = `/save-coordinates-mobile`;

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getDriverLocation = async(schedule_id) => {
    const _endpoint = `/get-by-schedule?schedule_id=${schedule_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

// export const getAddressByCEP = async (cep) => {
//     const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

//     return response;
// };