import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { userTypeEnum } from "../utils/userTypeEnum";

const defaultAuthProvider = {
    userData: null,
    token: null,
    hasStudent: false,
    handleGenerateToken: () => {},
    handleSaveUserData: (data) => {},
    handleVerifyStudent: (data) => {}
};

export const AuthContext = createContext(defaultAuthProvider);

export function AuthProvider({children}) {
    const [token, setToken] = useState("");
    const [hasStudent, setHasStudent] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleSaveUserData = (data) => {
        setUserData(data);
    };
    
    const handleVerifyStudent = (data) => {
        if(data.user_type_id === userTypeEnum.RESPONSAVEL){
            
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
            handleGenerateToken,
            handleSaveUserData,
            handleVerifyStudent
        }}>
            {children}
        </AuthContext.Provider>
    );
}