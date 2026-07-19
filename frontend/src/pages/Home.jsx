import { useAuth } from "../AuthContext.jsx";

export default function Home() {
    const { user, setAuth } = useAuth();

    //console.log(user);
    
    return (
        <h1>Home</h1>
    );
}