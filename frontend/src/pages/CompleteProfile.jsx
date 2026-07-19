import { useState } from "react";

export default function CompleteProfile() {
    const [username, setUsername] = useState("");

    
    return (
        <div>
            <form>
                <input 
                type="text"
                value={username}

                />
            </form>            
        </div>
    );
};