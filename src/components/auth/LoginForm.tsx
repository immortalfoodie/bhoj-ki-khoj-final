import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormInput from "./FormInput";

interface LoginFormProps {
  email: string;
  password: string;
  onSubmit?: (email: string, password: string) => Promise<void>;
}

const LoginForm = ({ email: initialEmail, password: initialPassword, onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [isLoading, setIsLoading] = useState(false);

  const demoCredentials = [
    { email: "user@example.com", password: "password123", label: "User" },
    { email: "admin123@gmail.com", password: "admin123456", label: "Admin" },
    { email: "restaurant@example.com", password: "restaurant123", label: "Restaurant" },
    { email: "dabbawala@example.com", password: "dabbawala123", label: "Dabbawala" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-bhoj-primary hover:bg-bhoj-dark"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="text-bhoj-primary font-medium hover:underline"
        >
          Sign up
        </Link>
      </div>

      <div className="mt-6">
        <div className="text-center text-xs text-gray-500 mb-2">Demo Accounts:</div>
        <div className="grid grid-cols-2 gap-2">
          {demoCredentials.map((cred, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setEmail(cred.email);
                setPassword(cred.password);
              }}
            >
              {cred.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default LoginForm;
