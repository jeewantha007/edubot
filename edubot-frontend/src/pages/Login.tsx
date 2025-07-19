import { LoginRegister } from '@/components/LoginRegister';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    if (onLogin) onLogin();
    navigate('/');
  };

  return <LoginRegister onLoginSuccess={handleLoginSuccess} />;
};

export default Login;