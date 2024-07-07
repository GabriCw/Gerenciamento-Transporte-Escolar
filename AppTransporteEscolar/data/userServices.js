import axios from "axios";

const apiUrl = 'http://192.168.15.5:8000';
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