import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setAuth = (authUser) => {
        setUser(authUser);
    };

    return (
        <AuthContext.Provider value={{user, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

//custom hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;