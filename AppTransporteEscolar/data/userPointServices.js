import axios from "axios";
import { APP_URL } from "@env";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const apiUrl = APP_URL;
const _controller = apiUrl + '/user-point';

export const getDriverByCode = async(code, token) => {
    const _endpoint = `/driver-school-by-code?code=${code}`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        if(error.response.status === 500){
            await signOut(auth);
        }
        return error.response;
    }
};
