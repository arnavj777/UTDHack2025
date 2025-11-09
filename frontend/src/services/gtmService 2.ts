import { api, ApiError } from './api';
import { GTMStrategy } from '../types/GTMStrategy';
import { ContentAsset } from '../types/ContentAsset';
import { LaunchChecklist } from '../types/LaunchChecklist';

// GTM Strategy Service
export const gtmStrategyService = {
  async list(): Promise<GTMStrategy[]> {
    try {
      const response = await api.get<{ items: GTMStrategy[] }>('/gtm-strategy/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch GTM strategies');
    }
  },

  async get(id: number): Promise<GTMStrategy> {
    try {
      return await api.get<GTMStrategy>(`/gtm-strategy/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch GTM strategy');
    }
  },

  async create(data: Partial<GTMStrategy>): Promise<GTMStrategy> {
    try {
      return await api.post<GTMStrategy>('/gtm-strategy/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create GTM strategy');
    }
  },

  async update(id: number, data: Partial<GTMStrategy>): Promise<GTMStrategy> {
    try {
      return await api.put<GTMStrategy>(`/gtm-strategy/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update GTM strategy');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/gtm-strategy/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete GTM strategy');
    }
  },
};

// Content Asset Service
export const contentAssetService = {
  async list(): Promise<ContentAsset[]> {
    try {
      const response = await api.get<{ items: ContentAsset[] }>('/content/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch content assets');
    }
  },

  async get(id: number): Promise<ContentAsset> {
    try {
      return await api.get<ContentAsset>(`/content/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch content asset');
    }
  },

  async create(data: Partial<ContentAsset>): Promise<ContentAsset> {
    try {
      return await api.post<ContentAsset>('/content/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create content asset');
    }
  },

  async update(id: number, data: Partial<ContentAsset>): Promise<ContentAsset> {
    try {
      return await api.put<ContentAsset>(`/content/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update content asset');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/content/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete content asset');
    }
  },

  async generateContent(type: string, prompt: string): Promise<string> {
    // Mock AI content generation
    return `AI generated ${type} content`;
  },
};

// Launch Checklist Service
export const launchChecklistService = {
  async list(): Promise<LaunchChecklist[]> {
    try {
      const response = await api.get<{ items: LaunchChecklist[] }>('/launch-checklist/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch launch checklists');
    }
  },

  async get(id: number): Promise<LaunchChecklist> {
    try {
      return await api.get<LaunchChecklist>(`/launch-checklist/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch launch checklist');
    }
  },

  async create(data: Partial<LaunchChecklist>): Promise<LaunchChecklist> {
    try {
      return await api.post<LaunchChecklist>('/launch-checklist/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create launch checklist');
    }
  },

  async update(id: number, data: Partial<LaunchChecklist>): Promise<LaunchChecklist> {
    try {
      return await api.put<LaunchChecklist>(`/launch-checklist/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update launch checklist');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/launch-checklist/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete launch checklist');
    }
  },

  async assessRisk(checklistId: number): Promise<any> {
    // Mock AI risk assessment
    return { risks: ['Risk 1', 'Risk 2'], score: 75 };
  },
};

