import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Map, Navigation, Package, Bike, BarChart, LogOut, Menu } from 'lucide-react';

const DabbawalaLayout = () => {
  const { isAuthenticated, isDabbawala, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for dabbawala access and redirect if not authorized
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login to access dabbawala dashboard",
        variant: "destructive",
      });
      navigate('/login');
    } else if (!isDabbawala) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access dabbawala dashboard",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, isDabbawala, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  if (!isAuthenticated || !isDabbawala) {
    return null;
  }

  const menuItems = [
    { icon: BarChart, label: 'Dashboard', path: '/dabbawala' },
    { icon: Package, label: 'Orders', path: '/dabbawala/orders' },
    { icon: Map, label: 'Route Map', path: '/dabbawala/route' },
    { icon: Navigation, label: 'Navigation', path: '/dabbawala/navigation' },
    { icon: Bike, label: 'Delivery History', path: '/dabbawala/history' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r">
        <div className="flex-1 flex flex-col pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-bhoj-primary">Dabbawala Dashboard</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-bhoj-primary"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold text-bhoj-primary">Dabbawala Dashboard</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <nav className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-bhoj-primary"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DabbawalaLayout;
