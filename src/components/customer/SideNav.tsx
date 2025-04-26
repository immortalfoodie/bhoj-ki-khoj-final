
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Home, FileText, Search, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Orders", path: "/orders" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: User, label: "Profile", path: "/profile" }
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-green-200">
      <div className="flex items-center justify-center py-4 bg-green-700 text-white">
        <h1 className="text-xl font-bold">
          Bhoj-ki-Khoj
        </h1>
      </div>
      
      <div className="flex-1 py-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 ${
              location.pathname === item.path 
                ? "bg-green-100 text-green-800 border-l-4 border-green-600" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon size={20} className="mr-3" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      
      {user && (
        <div className="border-t border-green-200 p-4 bg-green-50">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 mr-3">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()} 
            className="text-red-500 text-sm w-full text-left hover:bg-red-50 rounded-md py-2"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default SideNav;
