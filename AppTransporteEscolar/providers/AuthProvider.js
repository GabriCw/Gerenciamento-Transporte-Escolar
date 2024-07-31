import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { userTypeEnum } from "../utils/userTypeEnum";
import { getStudentByResponsible } from "../data/studentServices";

const defaultAuthProvider = {
    userData: null,
    token: null,
    hasStudent: false,
    handleGenerateToken: () => {},
    handleSaveUserData: (data) => {},
    handleVerifyStudent: async(data) => {}
};

export const AuthContext = createContext(defaultAuthProvider);

export function AuthProvider({children}) {
    const [token, setToken] = useState("");
    const [hasStudent, setHasStudent] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleSaveUserData = (data) => {
        setUserData(data);
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

    return (
        <AuthContext.Provider
        value={{
            userData,
            token,
            hasStudent,
            handleGenerateToken,
            handleSaveUserData,
            handleVerifyStudent
        }}>
            {children}
        </AuthContext.Provider>
    );
}