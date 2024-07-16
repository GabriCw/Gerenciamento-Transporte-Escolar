import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

const defaultAuthProvider = {
    token: null,
    handleGenerateToken: () => {}
};

export const AuthContext = createContext(defaultAuthProvider);

export function AuthProvider({children}) {
    const [token, setToken] = useState("");

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
            token,
            handleGenerateToken
        }}>
            {children}
        </AuthContext.Provider>
    );
}