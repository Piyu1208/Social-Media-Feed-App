import { Link } from "react-router-dom";
import { Bell, House, Search, User } from "lucide-react";
import { PlusSquare } from "lucide-react";

export default function Navbar({ onCreatePost }) {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <h1 className="text-lg font-bold">MyApp</h1>

        <div className="flex items-center gap-4">
          <Link to="/">
            <House className="h-5 w-5" />
          </Link>

          <Link to="/search">
            <Search className="h-5 w-5" />
          </Link>

          <button
            onClick={onCreatePost}
            className="rounded-full p-2 transition hover:bg-muted"
            aria-label="Create post"
          >
            <PlusSquare className="h-5 w-5" />
          </button>

          <Link to="/notifications">
            <Bell className="h-5 w-5" />
          </Link>

          <Link to="/profile">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
