import { Edubot } from '@/components/Edubot';
import { useState } from 'react';
import { LoginRegister } from '@/components/LoginRegister';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to false to show login first

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginRegister onLoginSuccess={handleLoginSuccess} />;
  }

  return <Edubot />;
};

export default Index;
