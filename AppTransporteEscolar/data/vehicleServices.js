import axios from "axios";
import { APP_URL } from "@env";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const apiUrl = APP_URL;
const _controller = apiUrl + '/vehicle';

export const getVehicleByUser = async(id, token) => {
    const _endpoint = `/get-list-by-driver?user_id=${id}`;

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

export const updateVehicle = async(body, token) => {
    const _endpoint = '/update';

    try{
        const response  = await axios.put(_controller + _endpoint, body, {
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

export const createVehicle = async(body, token) => {
    const _endpoint = '/create';

    try{
        const response  = await axios.post(_controller + _endpoint, body, {
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

export const removeVehicle = async(id, token) => {
    const _endpoint = `/delete?vehicle_id=${id}`;

    try{
        const response  = await axios.delete(_controller + _endpoint, {
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

export const getVehicleListByUser = async(user_id, token) => {
    const _endpoint = `/get-list-by-driver?user_id=${user_id}`;

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

export const associateVehicleToPoint = async(body, token) => {
    const _endpoint = `/associate-point`;

    try{
        const response  = await axios.put(_controller + _endpoint, body, {
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