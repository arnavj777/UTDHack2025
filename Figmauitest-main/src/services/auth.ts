import { api, ApiError } from './api';
import { API_ENDPOINTS } from '../config/api';

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name?: string;
  username?: string;
}

export interface AuthResponse {
  token?: string;
  user?: {
    id: number;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  message?: string;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

// Auth service
export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );
      
      // Store token if provided
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
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
        API_ENDPOINTS.SIGNUP,
        data
      );
      
      // Store token if provided
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Signup failed');
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return null;
      }
      
      return await api.get<User>(API_ENDPOINTS.USER);
    } catch (error) {
      // If unauthorized, clear token
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem('auth_token');
      }
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};

