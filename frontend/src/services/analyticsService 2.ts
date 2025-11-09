import { api, ApiError } from './api';
import { Metric } from '../types/Metric';
import { AIInsight } from '../types/AIInsight';
import { Experiment } from '../types/Experiment';

// Metric Service
export const metricService = {
  async list(): Promise<Metric[]> {
    try {
      const response = await api.get<{ items: Metric[] }>('/metrics/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch metrics');
    }
  },

  async get(id: number): Promise<Metric> {
    try {
      return await api.get<Metric>(`/metrics/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch metric');
    }
  },

  async create(data: Partial<Metric>): Promise<Metric> {
    try {
      return await api.post<Metric>('/metrics/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create metric');
    }
  },

  async update(id: number, data: Partial<Metric>): Promise<Metric> {
    try {
      return await api.put<Metric>(`/metrics/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update metric');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/metrics/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete metric');
    }
  },
};

// AI Insight Service
export const aiInsightService = {
  async list(): Promise<AIInsight[]> {
    try {
      const response = await api.get<{ items: AIInsight[] }>('/ai-insights/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch AI insights');
    }
  },

  async get(id: number): Promise<AIInsight> {
    try {
      return await api.get<AIInsight>(`/ai-insights/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch AI insight');
    }
  },

  async create(data: Partial<AIInsight>): Promise<AIInsight> {
    try {
      return await api.post<AIInsight>('/ai-insights/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create AI insight');
    }
  },

  async update(id: number, data: Partial<AIInsight>): Promise<AIInsight> {
    try {
      return await api.put<AIInsight>(`/ai-insights/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update AI insight');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/ai-insights/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete AI insight');
    }
  },

  async explainChart(chartData: any): Promise<string> {
    // Mock AI explanation
    return 'AI explanation of the chart';
  },

  async generateReport(timeframe: string): Promise<any> {
    // Mock AI report generation
    return { report: 'AI generated report' };
  },
};

// Experiment Service
export const experimentService = {
  async list(): Promise<Experiment[]> {
    try {
      const response = await api.get<{ items: Experiment[] }>('/experiments/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch experiments');
    }
  },

  async get(id: number): Promise<Experiment> {
    try {
      return await api.get<Experiment>(`/experiments/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch experiment');
    }
  },

  async create(data: Partial<Experiment>): Promise<Experiment> {
    try {
      return await api.post<Experiment>('/experiments/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create experiment');
    }
  },

  async update(id: number, data: Partial<Experiment>): Promise<Experiment> {
    try {
      return await api.put<Experiment>(`/experiments/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update experiment');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/experiments/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete experiment');
    }
  },

  async interpretResults(experimentId: number): Promise<any> {
    // Mock AI interpretation
    return { interpretation: 'AI interpretation of results' };
  },
};

