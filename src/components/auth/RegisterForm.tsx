
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegisterForm = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("user");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (!authContext) {
        throw new Error("Authentication context is not available");
      }
      
      console.log("Registering with role:", role);
      await authContext.register(name, email, password, role);
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        // Redirect based on role
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "restaurant") {
          navigate("/restaurant");
        } else if (role === "dabbawala") {
          navigate("/dabbawala");
        } else {
          navigate("/");
        }
      }, 100);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={isLoading}
          icon={<User className="h-4 w-4" />}
        />

        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
          icon={<Mail className="h-4 w-4" />}
        />

        <FormInput
          id="phone"
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+91 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
          icon={<Phone className="h-4 w-4" />}
        />
        
        <div className="space-y-1">
          <label htmlFor="role" className="text-sm font-medium">
            Register as
          </label>
          <Select 
            value={role} 
            onValueChange={(value) => setRole(value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Customer</SelectItem>
              <SelectItem value="restaurant">Restaurant Owner</SelectItem>
              <SelectItem value="dabbawala">Dabbawala</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
          icon={<Lock className="h-4 w-4" />}
        />

        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={isLoading}
          icon={<Lock className="h-4 w-4" />}
        />

        <Button
          type="submit"
          className="w-full bg-bhoj-primary hover:bg-bhoj-dark"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-bhoj-primary font-medium hover:underline"
        >
          Login
        </Link>
      </div>
    </>
  );
};

export default RegisterForm;
