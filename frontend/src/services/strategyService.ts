import { api, ApiError } from './api';
import { ProductStrategy } from '../types/ProductStrategy';
import { Idea } from '../types/Idea';
import { MarketSizing } from '../types/MarketSizing';
import { ScenarioPlan } from '../types/ScenarioPlan';

// Product Strategy Service
export const productStrategyService = {
  async list(): Promise<ProductStrategy[]> {
    try {
      const response = await api.get<ProductStrategy[]>('/strategy/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch product strategies');
    }
  },

  async get(id: number): Promise<ProductStrategy> {
    try {
      return await api.get<ProductStrategy>(`/strategy/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch product strategy');
    }
  },

  async create(data: Partial<ProductStrategy>): Promise<ProductStrategy> {
    try {
      return await api.post<ProductStrategy>('/strategy/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create product strategy');
    }
  },

  async update(id: number, data: Partial<ProductStrategy>): Promise<ProductStrategy> {
    try {
      return await api.put<ProductStrategy>(`/strategy/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update product strategy');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/strategy/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete product strategy');
    }
  },

  async generateAI(prompt: string): Promise<any> {
    // Mock AI generation - can be replaced with actual endpoint
    return { suggestions: ['AI suggestion 1', 'AI suggestion 2'] };
  },
};

// Idea Service
export const ideaService = {
  async list(): Promise<Idea[]> {
    try {
      const response = await api.get<Idea[]>('/ideas/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch ideas');
    }
  },

  async get(id: number): Promise<Idea> {
    try {
      return await api.get<Idea>(`/ideas/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch idea');
    }
  },

  async create(data: Partial<Idea>): Promise<Idea> {
    try {
      return await api.post<Idea>('/ideas/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create idea');
    }
  },

  async update(id: number, data: Partial<Idea>): Promise<Idea> {
    try {
      return await api.put<Idea>(`/ideas/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update idea');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/ideas/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete idea');
    }
  },

  async generateAI(prompt: string): Promise<any> {
    // Mock AI generation
    return { ideas: ['AI generated idea 1', 'AI generated idea 2'] };
  },
};

// Market Sizing Service
export const marketSizingService = {
  async list(): Promise<MarketSizing[]> {
    try {
      const response = await api.get<MarketSizing[]>('/market-sizing/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch market sizings');
    }
  },

  async get(id: number): Promise<MarketSizing> {
    try {
      return await api.get<MarketSizing>(`/market-sizing/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch market sizing');
    }
  },

  async create(data: Partial<MarketSizing>): Promise<MarketSizing> {
    try {
      return await api.post<MarketSizing>('/market-sizing/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create market sizing');
    }
  },

  async update(id: number, data: Partial<MarketSizing>): Promise<MarketSizing> {
    try {
      return await api.put<MarketSizing>(`/market-sizing/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update market sizing');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/market-sizing/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete market sizing');
    }
  },
};

// Scenario Plan Service
export const scenarioPlanService = {
  async list(): Promise<ScenarioPlan[]> {
    try {
      const response = await api.get<ScenarioPlan[]>('/scenario-planning/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch scenario plans');
    }
  },

  async get(id: number): Promise<ScenarioPlan> {
    try {
      return await api.get<ScenarioPlan>(`/scenario-planning/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch scenario plan');
    }
  },

  async create(data: Partial<ScenarioPlan>): Promise<ScenarioPlan> {
    try {
      return await api.post<ScenarioPlan>('/scenario-planning/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create scenario plan');
    }
  },

  async update(id: number, data: Partial<ScenarioPlan>): Promise<ScenarioPlan> {
    try {
      return await api.put<ScenarioPlan>(`/scenario-planning/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update scenario plan');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/scenario-planning/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete scenario plan');
    }
  },
};

