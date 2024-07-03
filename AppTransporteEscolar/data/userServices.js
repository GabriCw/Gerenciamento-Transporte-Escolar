import axios from "axios";

const apiUrl = "http://127.0.0.1:8000";
const _controller = apiUrl + "/user";

export const createUser = async(body) => {
    const _endpoint = "/create";

    try{
        const response = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch{
        return error.response;
    }
};