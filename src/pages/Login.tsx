
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import LoginDemoCredentials from "@/components/auth/LoginDemoCredentials";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSetCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <AuthLayout 
      title="Login to Bhoj-ki-Khoj"
      description="Enter your email and password to login to your account"
      footer={
        <LoginDemoCredentials onSetCredentials={handleSetCredentials} />
      }
    >
      <LoginForm email={email} password={password} />
    </AuthLayout>
  );
};

export default Login;
