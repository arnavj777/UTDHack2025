import { api, ApiError } from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  preferences: Record<string, any>;
  onboarding_completed: boolean;
  onboarding_data?: Record<string, any>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

// Auth service
export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/login/',
        credentials
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Login failed');
    }
  },

  // Signup
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/signup/',
        data
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Signup failed');
    }
  },

  // Logout
  async logout(): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/logout/', {});
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Logout failed');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ user: User }>('/auth/user/');
      return response.user;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        // Not authenticated
        return null;
      }
      console.error('Failed to fetch current user:', error);
      return null;
    }
  },

  // Update preferences
  async updatePreferences(preferences: Record<string, any>): Promise<User> {
    try {
      const response = await api.put<{ user: User }>('/auth/preferences/', {
        preferences
      });
      return response.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update preferences');
    }
  },

  // Complete onboarding
  async completeOnboarding(onboardingData: Record<string, any>): Promise<User> {
    try {
      const response = await api.post<{ user: User }>('/auth/onboarding/', {
        onboarding_data: onboardingData
      });
      return response.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to complete onboarding');
    }
  },
};

