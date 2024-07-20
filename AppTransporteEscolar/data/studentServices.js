import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/student';

export const getStudentByResponsible = async(userId) => {
    const _endpoint = `/get-by-responsible?responsible_id=${userId}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};