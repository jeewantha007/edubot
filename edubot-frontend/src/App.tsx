import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import { Edubot } from './components/Edubot';
import { ThemeProvider } from '@/components/ThemeToggle';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    console.log('[App] useEffect: jwt_token in localStorage:', token);
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem('jwt_token');
    console.log('[App] handleLogin: jwt_token in localStorage after login:', token);
    setIsAuthenticated(true);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Edubot /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
