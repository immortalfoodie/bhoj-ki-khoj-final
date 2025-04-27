import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  Truck,
  MessageSquare,
  ChevronRight,
  Users,
  PieChart
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Restaurants",
      icon: <Utensils className="h-5 w-5" />,
      href: "/admin/restaurants",
    },
    {
      title: "Dabbawalas",
      icon: <Truck className="h-5 w-5" />,
      href: "/admin/dabbawalas",
    },
    {
      title: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/admin/orders",
    },
    {
      title: "Menu",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/menu",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    },
    {
      title: "Analytics",
      icon: <PieChart className="h-5 w-5" />,
      href: "/admin/analytics",
    },
    {
      title: "Feedback",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/feedback",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold text-gray-900">
              Bhoj<span className="text-bhoj-primary">-Admin</span>
            </h1>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? "bg-bhoj-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-5 text-sm font-medium text-red-600 rounded-md hover:bg-red-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden bg-bhoj-primary shadow">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-bold text-white">
              Bhoj<span className="text-white">-Admin</span>
            </h1>
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-1 text-white focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white">
                <div className="flex flex-col h-full">
                  <div className="px-4 py-6">
                    <h2 className="text-lg font-semibold text-gray-900">Admin Menu</h2>
                  </div>
                  <nav className="flex-1 px-2 space-y-1">
                    <ul className="space-y-1">
                      {sidebarItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                              location.pathname === item.href
                                ? "bg-bhoj-primary text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {item.icon}
                            <span className="ml-3">{item.title}</span>
                            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 mt-5 text-sm font-medium text-red-600 rounded-md hover:bg-red-100"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Logout
                    </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
