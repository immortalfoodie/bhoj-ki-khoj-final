import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Utensils, 
  ShoppingBag, 
  FileText, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  LogOut, 
  Menu,
  ChevronRight
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';

const RestaurantLayout = () => {
  const { isAuthenticated, isRestaurant, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login to access restaurant dashboard",
        variant: "destructive",
      });
      navigate('/login');
    } else if (!isRestaurant) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access restaurant dashboard",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, isRestaurant, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  if (!isAuthenticated || !isRestaurant) {
    return null;
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/restaurant",
    },
    {
      title: "Menu",
      icon: <Utensils className="h-5 w-5" />,
      href: "/restaurant/menu",
    },
    {
      title: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/restaurant/orders",
    },
    {
      title: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
      href: "/restaurant/schedule",
    },
    {
      title: "Customers",
      icon: <Users className="h-5 w-5" />,
      href: "/restaurant/customers",
    },
  ];

  return (
    <div className="flex h-screen bg-amber-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-amber-200">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold text-amber-800">
              Bhoj<span className="text-amber-500">-Restaurant</span>
            </h1>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center px-2 py-2 text-sm font-medium text-amber-700 rounded-md hover:bg-amber-100"
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
        <div className="md:hidden bg-amber-700 shadow">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-bold text-white">
              Bhoj<span className="text-amber-200">-Restaurant</span>
            </h1>
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-1 text-white focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-amber-50">
                <div className="flex flex-col h-full">
                  <div className="px-4 py-6">
                    <h2 className="text-lg font-semibold text-amber-900">Restaurant Menu</h2>
                  </div>
                  <nav className="flex-1 px-2 space-y-1">
                    <ul className="space-y-1">
                      {sidebarItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="flex items-center px-2 py-2 text-sm font-medium text-amber-700 rounded-md hover:bg-amber-100"
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
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-amber-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
