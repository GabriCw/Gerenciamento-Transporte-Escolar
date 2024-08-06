import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { userTypeEnum } from "../utils/userTypeEnum";
import { getStudentByResponsible } from "../data/studentServices";
import { getUserByEmail, getUserDetails } from "../data/userServices";

const defaultAuthProvider = {
    userData: null,
    token: null,
    hasStudent: false,
    pointsData: [],
    phonesData: [],
    handleGenerateToken: async() => {},
    handleVerifyStudent: async(data) => {},
    handleUpdateUserdata: async() => {},
    handleGetUserDetails: async(id) => {}
};

export const AuthContext = createContext(defaultAuthProvider);

export function AuthProvider({children}) {
    const [token, setToken] = useState("");
    const [hasStudent, setHasStudent] = useState(false);
    const [userData, setUserData] = useState(null);
    const [pointsData, setPointsData] = useState([]);
    const [phonesData, setPhonesData] = useState([]);

    const handleGetUserDetails = async(id) => {
        const response = await getUserDetails(id);
        console.log(response.data)
        if(response.status === 200){
            setUserData(response.data.user);
            setPointsData(response.data.points);
            setPhonesData(response.data.phone);

            return true;
        }
        else{
            return false;
        }
    };

    const handleVerifyStudent = async(data) => {
        if(data.user_type_id === userTypeEnum.RESPONSAVEL){
            const response = await getStudentByResponsible(data.id);

            if(response.status === 200){
                setHasStudent(true);
                return true;
            }
            else{
                setHasStudent(false);
                return false;
            }
        }
    };

    const handleGenerateToken = async() => {
        const currentUser = auth.currentUser;

        if(currentUser){
            try{
                const jwtToken = await currentUser.getIdToken();
                setToken(jwtToken);
            }
            catch(e){
                console.log("erro: ", e)
            }
        }
    };

    const handleUpdateUserdata = async() => {
        const response = await handleGetUserDetails(userData.id);

        return response;
    };

    return (
        <AuthContext.Provider
        value={{
            userData,
            token,
            hasStudent,
            pointsData,
            phonesData,
            handleGenerateToken,
            handleVerifyStudent,
            handleUpdateUserdata,
            handleGetUserDetails
        }}>
            {children}
        </AuthContext.Provider>
    );
}