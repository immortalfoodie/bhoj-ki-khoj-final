import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ShoppingCart, User, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const authContext = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to search results with the query
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = async () => {
    authContext.logout();
    navigate('/auth/login');
  };

  const getInitials = () => {
    if (!authContext.user?.name) return "U";
    return authContext.user.name.charAt(0).toUpperCase();
  };

  const getRedirectPath = () => {
    if (authContext.isAdmin) return "/admin";
    if (authContext.isRestaurant) return "/restaurant";
    if (authContext.isDabbawala) return "/dabbawala";
    return "/";
  };

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-bhoj-dark">
              Bhoj<span className="text-bhoj-primary">-ki-</span>Khoj
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search for food, restaurants, cuisines..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-bhoj-primary focus:ring-bhoj-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="checkout" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-bhoj-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {authContext.isAuthenticated && authContext.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={authContext.user.avatar} />
                    <AvatarFallback className="bg-bhoj-primary text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">{authContext.user.name}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(getRedirectPath())}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/auth/login")} className="bg-bhoj-primary hover:bg-bhoj-dark">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <Link to="/checkout" className="relative mr-4">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-bhoj-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <span className="text-lg font-semibold">Menu</span>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="w-full relative mb-6">
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </form>

                  {/* Mobile Menu Items */}
                  <div className="flex flex-col space-y-4">
                    <Link to="/" className="py-2 px-4 hover:bg-gray-100 rounded-md">
                      Home
                    </Link>
                    <Link to="/checkout" className="py-2 px-4 hover:bg-gray-100 rounded-md">
                      Cart
                    </Link>
                    
                    {authContext.isAuthenticated && authContext.user ? (
                      <>
                        <Link to="/profile" className="py-2 px-4 hover:bg-gray-100 rounded-md">
                          My Profile
                        </Link>
                        <Link to={getRedirectPath()} className="py-2 px-4 hover:bg-gray-100 rounded-md">
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="py-2 px-4 text-left text-red-500 hover:bg-gray-100 rounded-md"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link to="/auth/login" className="py-2 px-4 bg-bhoj-primary text-white hover:bg-bhoj-dark rounded-md text-center">
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
