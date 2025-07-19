import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import { Edubot } from './components/Edubot';
import { ThemeProvider } from '@/components/ThemeToggle';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('jwt_token'));
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={() => setIsAuthenticated(true)} />}
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
