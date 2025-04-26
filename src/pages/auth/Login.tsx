import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import LoginSwitcher from "@/components/auth/LoginSwitcher";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get the redirect path from location state, or default to "/"
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    
    try {
      const userRole = await authContext.login(email, password);
      console.log("Login successful, user role:", userRole);

      // Navigate based on role
      switch (userRole) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "restaurant":
          navigate("/restaurant", { replace: true });
          break;
        case "dabbawala":
          navigate("/dabbawala", { replace: true });
          break;
        default:
          navigate(from, { replace: true });
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <LoginSwitcher onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Login;
