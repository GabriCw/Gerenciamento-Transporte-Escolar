import axios from "axios";
import { APP_URL } from "@env";

const apiUrl = APP_URL;
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

export const createStudent = async(body) => {
    const _endpoint = `/create`;

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const createStudentList = async(body) => {
    const _endpoint = `/create-list`;

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const deleteStudent = async(id) => {
    const _endpoint = `/delete?student_id=${id}`;

    try{
        const response  = await axios.delete(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updateStudent = async(body) => {
    const _endpoint = `/update`;

    try{
        const response  = await axios.put(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getStudentByCode = async(studentCode) => {
    const _endpoint = `/get-by-code?student_code=${studentCode}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const associationStudent = async(body) => {
    const _endpoint = `/association`;

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const disassociationStudent = async(body) => {
    const _endpoint = `/disassociation`;

    try{
        const response  = await axios.post(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getStudentDetails = async(student_id) => {
    const _endpoint = `/details?student_id=${student_id}`;

    try{
        const response  = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getListAllHomes = async(student_id, user_id) => {
    const _endpoint = "/list-all-homes";
    
    const headerBody = {
        'student-id': student_id,
        'user-id': user_id
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

export const updateAddress = async(body) => {
    const _endpoint = "/update-address";

    try{
        const response = await axios.put(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const updateAddressByPoint = async(body) => {
    const _endpoint = "/update-address-by-point";

    try{
        const response = await axios.put(_controller + _endpoint, body);

        return response;
    }
    catch(error){
        return error.response;
    }
};

export const getStudentsByResponsiblePoint = async(responsible_id) => {
    const _endpoint = `/get-by-point-responsible?responsible_id=${responsible_id}`

    try{
        const response = await axios.get(_controller + _endpoint);

        return response;
    }
    catch(error){
        return error.response;
    }
};