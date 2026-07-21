import { Link } from "react-router-dom";


export default function Navbar() {


    return (
        <header>
            <div>App</div>

            <nav>
                <button>Search</button>
                <button>Notifications</button>
                <Link to="/profile">Profile</Link>
            </nav>
        </header>
    );
}