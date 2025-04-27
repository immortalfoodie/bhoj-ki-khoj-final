
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <AuthLayout 
      title="Create an Account"
      description="Sign up to start ordering delicious homemade food"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
