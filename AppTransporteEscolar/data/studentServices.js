import axios from "axios";

const apiUrl = 'https://school-transport-backend-3fec5c45f086.herokuapp.com';
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