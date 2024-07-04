import axios from "axios";

const apiUrl = 'http://192.168.0.149:8000';
const _controller = apiUrl + '/user';

export const createUser = async(body) => {
    const _endpoint = '/create';

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        if(response.status === 201){
            return true;
        }
        else{
            return false
        }
    }
    catch(error){
        return error;
    }
};