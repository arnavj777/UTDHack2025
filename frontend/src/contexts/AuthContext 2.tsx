import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User; message: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: Record<string, any>) => Promise<void>;
  completeOnboarding: (onboardingData: Record<string, any>) => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      // Response should always have user property based on AuthResponse type
      if (response && response.user) {
        setUser(response.user);
        return response;
      }
      throw new Error('Invalid login response format');
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const response = await authService.signup({ email, password, fullName });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user state even if logout request fails
      setUser(null);
    }
  };

  const updatePreferences = async (preferences: Record<string, any>) => {
    try {
      const updatedUser = await authService.updatePreferences(preferences);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const completeOnboarding = async (onboardingData: Record<string, any>) => {
    try {
      const updatedUser = await authService.completeOnboarding(onboardingData);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updatePreferences,
        completeOnboarding,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

