import axios from "axios";
import { APP_URL } from "@env";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const apiUrl = APP_URL;

// Coordenadas
const coordinateController = apiUrl + '/coordinate';
// Schedule
const scheduleController = apiUrl + '/schedule';

// Função para salvar a localização do motorista
export const postDriverLocation = async(body, token) => {
    const endpoint = `/save-coordinates-mobile`;

    try{
        const response  = await axios.post(coordinateController + endpoint, body, {
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

// Função para obter a localização do motorista
export const getDriverLocation = async(schedule_id, token) => {
    const endpoint = `/get-by-schedule?schedule_id=${schedule_id}`;

    try{
        const response  = await axios.get(coordinateController + endpoint, {
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

// Função para obter a localização do motorista
export const getDriversLastPosition = async(schedule_id, user_id, token) => {
    const endpoint = `/get-last-position-by-schedule`;

    try{
        const response = await axios.get(coordinateController + endpoint, {
            headers: {
                "schedule-id": schedule_id,
                "user-id": user_id,
                "Authorization": "Bearer " + token
            }
        });
        return response;
    }
    catch(error){
        return error.response;
    }
};

// Função para obter informações da schedule (viagem)
export const getCurrentSchedules = async(user_id, token) => {
    const endpoint = `/get-current-schedules-by-user?user_id=${user_id}`;

    try{
        const response  = await axios.get(scheduleController + endpoint, {
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


// Função para criar um novo schedule
export const createSchedule = async(body, token) => {
    const endpoint = `/create`;

    try{
        const response = await axios.post(scheduleController + endpoint, body, {
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

// Função para iniciar o schedule
export const startSchedule = async(body, token) => {
    const endpoint = `/start`;

    try{
        const response = await axios.put(scheduleController + endpoint, body, {
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

// Função para obter detalhes do schedule para o motorista
export const getDriverScheduleDetails = async(schedule_id, token) => {
    const endpoint = `/current-driver-details?schedule_id=${schedule_id}`;

    try{
        const response = await axios.get(scheduleController + endpoint, {
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

// Função para atualizar o status de um ponto (aluno)
export const updateSchedulePoint = async(body, token) => {
    const endpoint = `/point`;

    try{
        const response = await axios.put(scheduleController + endpoint, body, {
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

// Função para encerrar o schedule
export const endSchedule = async(body, token) => {
    const endpoint = `/end`;

    try{
        const response = await axios.put(scheduleController + endpoint, body, {
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

// Função para obter informações de mapa para o responsável
export const getScheduleMapsInfos = async(schedule_id, user_id, token) => {
    const endpoint = `/get-maps-infos`;

    try{
        const response = await axios.get(scheduleController + endpoint, {
            headers: {
                "schedule-id": schedule_id,
                "user-id": user_id,
                "Authorization": "Bearer " + token
            }
        });
        return response;
    }
    catch(error){
        return error.response;
    }
};

// Função para obter a posição do aluno na fila
export const getStudentPosition = async(schedule_id, user_id, token) => {
    const endpoint = `/get-student-position`;

    try{
        const response = await axios.get(scheduleController + endpoint, {
            headers: {
                "schedule-id": schedule_id,
                "user-id": user_id,
                "Authorization": "Bearer " + token
            }
        });
        return response;
    }
    catch(error){
        return error.response;
    }
};


// Função para obter schedule por aluno
export const getByStudent = async(student_id, user_id, token) => {
    const endpoint = `/by-student`;

    try{
        const response = await axios.get(scheduleController + endpoint, {
            headers: {
                "student-id": student_id,
                "user-id": user_id,
                "Authorization": "Bearer " + token
            }
        });
        return response;
    }
    catch(error){
        return error.response;
    }
};