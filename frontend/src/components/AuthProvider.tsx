import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode'; // Import JwtPayload
import {
  Navigate,
} from 'react-router-dom';

// Define the shape of our user object based on the JWT payload
interface User extends JwtPayload {
  id?: number;
  username?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decodedToken = jwtDecode<User>(token); // Type the decoded token
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            setUser(decodedToken);
          } else {
            localStorage.removeItem('Token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error decoding or verifying token:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    try {
      const decodedToken = jwtDecode<User>(token); // Type the decoded token
      setIsAuthenticated(true);
      setUser(decodedToken);
    } catch (error) {
      console.error('Error decoding token on login:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};