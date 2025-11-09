import { api, ApiError } from './api';
import { AIAgent } from '../types/AIAgent';
import { Workflow } from '../types/Workflow';

// AI Agent Service
export const aiAgentService = {
  async list(): Promise<AIAgent[]> {
    try {
      const response = await api.get<{ items: AIAgent[] }>('/ai-agent/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch AI agents');
    }
  },

  async get(id: number): Promise<AIAgent> {
    try {
      return await api.get<AIAgent>(`/ai-agent/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch AI agent');
    }
  },

  async create(data: Partial<AIAgent>): Promise<AIAgent> {
    try {
      return await api.post<AIAgent>('/ai-agent/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create AI agent');
    }
  },

  async update(id: number, data: Partial<AIAgent>): Promise<AIAgent> {
    try {
      return await api.put<AIAgent>(`/ai-agent/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update AI agent');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/ai-agent/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete AI agent');
    }
  },
};

// Workflow Service
export const workflowService = {
  async list(): Promise<Workflow[]> {
    try {
      const response = await api.get<{ items: Workflow[] }>('/workflow/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch workflows');
    }
  },

  async get(id: number): Promise<Workflow> {
    try {
      return await api.get<Workflow>(`/workflow/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch workflow');
    }
  },

  async create(data: Partial<Workflow>): Promise<Workflow> {
    try {
      return await api.post<Workflow>('/workflow/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create workflow');
    }
  },

  async update(id: number, data: Partial<Workflow>): Promise<Workflow> {
    try {
      return await api.put<Workflow>(`/workflow/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update workflow');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/workflow/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete workflow');
    }
  },

  async suggestAutomations(): Promise<any[]> {
    // Mock AI automation suggestions
    return [{ trigger: 'Event A', action: 'Action B' }];
  },
};

