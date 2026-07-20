import { useNavigate } from "react-router-dom";


export default function Navbar() {
    const navigate = useNavigate();

    return (
        <header>
            <div>App</div>

            <nav>
                <button>Search</button>
                <button>Notifications</button>
                <button>Profile</button>
            </nav>
        </header>
    );
}