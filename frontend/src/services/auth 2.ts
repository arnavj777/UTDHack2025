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
      // Response is already extracted by api.post, so it's {user: User, message: string}
      // Make sure the format is correct
      if (response && response.user) {
        return response;
      }
      // If response doesn't have user, it might be in a different format
      throw new Error('Invalid login response format');
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
      // Response is already extracted by api.get, so it's {user: User}
      if (response && response.user) {
        return response.user;
      }
      // If response is the user object directly (shouldn't happen but handle it)
      if (response && 'id' in response && 'email' in response) {
        return response as User;
      }
      return null;
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

  // Get OAuth login URL
  async getOAuthLoginUrl(provider: 'google' | 'github'): Promise<string> {
    try {
      const response = await api.get<{ url: string; provider: string }>(
        `/auth/oauth/login-url/?provider=${provider}`
      );
      return response.url;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get OAuth URL');
    }
  },
};

