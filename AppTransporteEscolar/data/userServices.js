import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/user';

export const createUser = async(body) => {
    const _endpoint = '/create';

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updateUserUuid = async(body) => {
    const _endpoint = '/update-uuid';

    try{
        const response  = await axios.put(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getUserByEmail = async(email) => {
    const _endpoint = `/by-email?email=${email}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getUserDetails = async(id) => {
    const _endpoint = `/details?user_id=${id}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updateUser = async(body) => {
    const _endpoint = '/update';

    try{
        const response  = await axios.put(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};