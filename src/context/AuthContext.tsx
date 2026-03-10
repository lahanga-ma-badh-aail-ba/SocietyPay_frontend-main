import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User, LoginRequest, RegisterRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/error-utils';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<string>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authAPI.login(data);
      
      // Store everything
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.user.name}!`,
      });

      // Return user role so Auth page can redirect appropriately
      return response.user.role;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Login failed');
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authAPI.register(data);
      
      toast({
        title: 'Registration Successful',
        description: 'Please login with your credentials.',
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Registration failed');
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const refreshUser = async () => {
    try {
      const { user: freshUser } = await authAPI.getProfile();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};