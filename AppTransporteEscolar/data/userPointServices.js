import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/user-point';

export const getStudentByCode = async(code) => {
    const _endpoint = `/driver-school-by-code?code=${code}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};
