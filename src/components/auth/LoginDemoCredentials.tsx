
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginDemoCredentialsProps {
  onSetCredentials: (email: string, password: string) => void;
}

const LoginDemoCredentials = ({ onSetCredentials }: LoginDemoCredentialsProps) => {
  return (
    <Alert className="w-full bg-gray-50 border-gray-200">
      <AlertDescription className="text-xs text-gray-500">
        <strong>Demo Logins:</strong><br />
        <button 
          onClick={() => onSetCredentials("user@example.com", "password123")} 
          className="text-bhoj-primary underline"
        >
          User:
        </button> user@example.com / password123<br />
        <button 
          onClick={() => onSetCredentials("restaurant@example.com", "restaurant123")} 
          className="text-bhoj-primary underline"
        >
          Restaurant:
        </button> restaurant@example.com / restaurant123<br />
        <button 
          onClick={() => onSetCredentials("dabbawala@example.com", "dabbawala123")} 
          className="text-bhoj-primary underline"
        >
          Dabbawala:
        </button> dabbawala@example.com / dabbawala123<br />
        <button 
          onClick={() => onSetCredentials("admin@example.com", "admin123")} 
          className="text-bhoj-primary underline"
        >
          Admin:
        </button> admin@example.com / admin123
      </AlertDescription>
    </Alert>
  );
};

export default LoginDemoCredentials;
