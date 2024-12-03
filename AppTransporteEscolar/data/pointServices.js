import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/point';

export const getPointByUser = async(user_id, token) => {
    const _endpoint = `/get-by-user?user_id=${user_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getPointByID = async(point_id, token) => {
    const _endpoint = `/get-by-id?point_id=${point_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updatePoint = async(body, token) => {
    const _endpoint = `/update`;

    try{
        const response  = await axios.put(_controller + _endpoint, body, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getAllSchoolList = async(token) => {
    const _endpoint = `/get-all-schools-list`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const associateDriverToSchool = async(body, token) => {
    const _endpoint = `/school-driver-association`;

    try{
        const response  = await axios.post(_controller + _endpoint, body, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const disassociateDriverToSchool = async(body, token) => {
    const _endpoint = `/school-driver-disassociation`;

    try{
        const response  = await axios.delete(_controller + _endpoint, {
            data: body,
            Authorization: "Bearer " + token
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getSchoolByUser = async(userId, token) => {
    const _endpoint = `/get-school-by-user?user_id=${userId}`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getSchoolByDriver = async(userId, token) => {
    const _endpoint = `/get-school-by-driver?user_id=${userId}`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getSchoolAssociatedByDriver = async(userId, token) => {
    const _endpoint = `/get-school-associated-by-driver?user_id=${userId}`;

    try{
        const response  = await axios.get(_controller + _endpoint, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};