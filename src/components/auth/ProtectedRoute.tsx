import { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  requiredRole?: "user" | "restaurant" | "dabbawala" | "admin";
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  
  // Show loading state while auth is initializing
  if (!authContext || authContext.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-bhoj-primary" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  // Not authenticated - redirect to login
  if (!authContext.isAuthenticated) {
    // Preserve the attempted URL for redirect after login
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has the required role
  const hasRequiredRole = () => {
    if (!requiredRole) return true;
    
    const { isAdmin, isRestaurant, isDabbawala } = authContext;
    
    console.log("Protected Route - Role Check:");
    console.log("Required role:", requiredRole);
    console.log("User role:", authContext.user?.role);
    console.log("Is admin:", isAdmin);
    console.log("Is restaurant:", isRestaurant);
    console.log("Is dabbawala:", isDabbawala);
    
    switch (requiredRole) {
      case "admin":
        return isAdmin;
      case "restaurant":
        return isRestaurant;
      case "dabbawala":
        return isDabbawala;
      case "user":
        return !isAdmin && !isRestaurant && !isDabbawala;
      default:
        return false;
    }
  };

  // Doesn't have required role - redirect to home
  if (requiredRole && !hasRequiredRole()) {
    return <Navigate to="/" replace />;
  }

  // All checks passed - render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
