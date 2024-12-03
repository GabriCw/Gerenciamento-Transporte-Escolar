import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = "http://127.0.0.1:8000";
const _controller = apiUrl + '/student';

export const getStudentByResponsible = async(userId, token) => {
    const _endpoint = `/get-by-responsible?responsible_id=${userId}`;

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

export const createStudent = async(body, token) => {
    const _endpoint = `/create`;

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

export const createStudentList = async(body, token) => {
    const _endpoint = `/create-list`;

    try{
        const response  = await axios.post(_controller + _endpoint, body,{
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

export const deleteStudent = async(id, token) => {
    const _endpoint = `/delete?student_id=${id}`;

    try{
        const response  = await axios.delete(_controller + _endpoint, {
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

export const updateStudent = async(body, token) => {
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

export const getStudentByCode = async(studentCode, token) => {
    const _endpoint = `/get-by-code?student_code=${studentCode}`;

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

export const associationStudent = async(body, token) => {
    const _endpoint = `/association`;

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

export const disassociationStudent = async(body, token) => {
    const _endpoint = `/disassociation`;

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

export const getStudentDetails = async(student_id, token) => {
    const _endpoint = `/details?student_id=${student_id}`;

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

export const getListAllHomes = async(student_id, user_id, token) => {
    const _endpoint = "/list-all-homes";
    
    const headerBody = {
        'student-id': student_id,
        'user-id': user_id,
        "Authorization": "Bearer " + token
    };

    try{
        const response = await axios.get(_controller + _endpoint, {
            headers: headerBody
        });

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updateAddress = async(body, token) => {
    const _endpoint = "/update-address";

    try{
        const response = await axios.put(_controller + _endpoint, body, {
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

export const updateAddressByPoint = async(body, token) => {
    const _endpoint = "/update-address-by-point";

    try{
        const response = await axios.put(_controller + _endpoint, body, {
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

export const getStudentsByResponsiblePoint = async(responsible_id, token) => {
    const _endpoint = `/get-by-point-responsible?responsible_id=${responsible_id}`

    try{
        const response = await axios.get(_controller + _endpoint, {
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