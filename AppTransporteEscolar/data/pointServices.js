import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
const _controller = apiUrl + '/point';

export const getPointByUser = async(user_id) => {
    const _endpoint = `/get-by-user?user_id=${user_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updatePoint = async(body) => {
    const _endpoint = `/update`;

    try{
        const response  = await axios.put(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getAllSchoolList = async() => {
    const _endpoint = `/get-all-schools-list`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const associateDriverToSchool = async(body) => {
    const _endpoint = `/school-driver-association`;

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const disassociateDriverToSchool = async(body) => {
    const _endpoint = `/school-driver-disassociation`;

    try{
        const response  = await axios.delete(_controller + _endpoint, {
            data: body
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getSchoolByUser = async(userId) => {
    const _endpoint = `/get-school-by-user?user_id=${userId}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getSchoolByDriver = async(userId) => {
    const _endpoint = `/get-school-by-driver?user_id=${userId}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getSchoolAssociatedByDriver = async(userId) => {
    const _endpoint = `/get-school-associated-by-driver?user_id=${userId}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};