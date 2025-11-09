import { api, ApiError } from './api';

export interface AIResponse<T> {
  data: T;
  message?: string;
}

// AI Service for all AI features
export const aiService = {
  // Generate Ideas
  async generateIdeas(context?: string, count: number = 5): Promise<any> {
    try {
      return await api.post<any>('/ai/generate-ideas/', { context, count });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to generate ideas');
    }
  },

  // Strategy Advice
  async getStrategyAdvice(visionStatement?: string, okrs?: any[]): Promise<any> {
    try {
      return await api.post<any>('/ai/strategy-advice/', { vision_statement: visionStatement, okrs });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get strategy advice');
    }
  },

  // Market Analysis
  async getMarketAnalysis(industry?: string, targetMarket?: string): Promise<any> {
    try {
      return await api.post<any>('/ai/market-analysis/', { industry, target_market: targetMarket });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get market analysis');
    }
  },

  // Roadmap Prioritization
  async prioritizeRoadmap(initiatives?: any[]): Promise<any> {
    try {
      return await api.post<any>('/ai/roadmap-prioritization/', { initiatives });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to prioritize roadmap');
    }
  },

  // Backlog Grooming
  async groomBacklog(backlogItems?: any[]): Promise<any> {
    try {
      return await api.post<any>('/ai/backlog-grooming/', { backlog_items: backlogItems });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to groom backlog');
    }
  },

  // Generate PRD
  async generatePRD(productName?: string, features?: string[]): Promise<any> {
    try {
      return await api.post<any>('/ai/generate-prd/', { product_name: productName, features });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to generate PRD');
    }
  },

  // Sprint Planning
  async planSprint(backlogItems?: any[], teamCapacity?: number): Promise<any> {
    try {
      return await api.post<any>('/ai/sprint-planning/', { backlog_items: backlogItems, team_capacity: teamCapacity });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to plan sprint');
    }
  },

  // GTM Strategy
  async getGTMStrategy(productName?: string, targetAudience?: string): Promise<any> {
    try {
      return await api.post<any>('/ai/gtm-strategy/', { product_name: productName, target_audience: targetAudience });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get GTM strategy');
    }
  },

  // Generate Content
  async generateContent(contentType?: string, topic?: string): Promise<any> {
    try {
      return await api.post<any>('/ai/generate-content/', { content_type: contentType, topic });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to generate content');
    }
  },

  // Launch Checklist
  async getLaunchChecklist(productType?: string): Promise<any> {
    try {
      return await api.post<any>('/ai/launch-checklist/', { product_type: productType });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get launch checklist');
    }
  },

  // Metrics Insights
  async getMetricsInsights(metricsData?: any): Promise<any> {
    try {
      return await api.post<any>('/ai/metrics-insights/', { metrics_data: metricsData });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get metrics insights');
    }
  },

  // Customer Feedback Analysis
  async analyzeCustomerFeedback(feedbackItems?: any[]): Promise<any> {
    try {
      return await api.post<any>('/ai/customer-feedback-analysis/', { feedback_items: feedbackItems });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to analyze customer feedback');
    }
  },

  // Competitor Analysis
  async analyzeCompetitors(competitors?: any[]): Promise<any> {
    try {
      return await api.post<any>('/ai/competitor-analysis/', { competitors });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to analyze competitors');
    }
  },

  // Persona Insights
  async getPersonaInsights(personaData?: any): Promise<any> {
    try {
      return await api.post<any>('/ai/persona-insights/', { persona_data: personaData });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get persona insights');
    }
  },

  // Research Insights
  async getResearchInsights(query?: string, researchData?: any): Promise<any> {
    try {
      return await api.post<any>('/ai/research-insights/', { query, research_data: researchData });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get research insights');
    }
  },

  // AI Assistant
  async askAssistant(query: string, context?: string): Promise<any> {
    try {
      return await api.post<any>('/ai/assistant/', { query, context });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to get AI assistant response');
    }
  },
};

