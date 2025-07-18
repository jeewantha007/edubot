import { LoginRegister } from '@/components/LoginRegister';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // In a real app, you would handle authentication state here
    navigate('/');
  };

  return <LoginRegister onLoginSuccess={handleLoginSuccess} />;
};

export default Login;