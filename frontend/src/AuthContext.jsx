import { createContext, useState, useContext, useEffect } from "react";
import api from "./api/axios.js";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setAuth = (authUser) => {
        setUser(authUser);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("users/auth/me");
                setUser(res.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, setAuth, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

//custom hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;