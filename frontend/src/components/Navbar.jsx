import { Link } from "react-router-dom";
import { Bell, House, Search, User, PlusSquare } from "lucide-react";
import { useNotifications } from "../NotificationContext.jsx";

export default function Navbar() {
  const { unreadCount } = useNotifications();

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/">
          <h1 className="text-lg font-bold">MyApp</h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/">
            <House className="h-5 w-5 hover:text-gray-300" />
          </Link>

          <Link to="/search">
            <Search className="h-5 w-5 hover:text-gray-300" />
          </Link>

          <Link to="/create-post">
            <PlusSquare className="h-5 w-5 hover:text-gray-300" />
          </Link>

          <Link to="/notifications" className="relative">
            <Bell className="h-5 w-5 hover:text-gray-300" />

            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link to="/profile">
            <User className="h-5 w-5 hover:text-gray-300" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
