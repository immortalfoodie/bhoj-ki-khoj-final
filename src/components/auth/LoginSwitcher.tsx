import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "./LoginForm";

interface LoginSwitcherProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

const LoginSwitcher = ({ onSubmit }: LoginSwitcherProps) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", { email, password });
      await onSubmit(email, password);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="w-full">
      <LoginForm 
        email=""
        password=""
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default LoginSwitcher;
