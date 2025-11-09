import { api, ApiError } from './api';
import { CustomerFeedback } from '../types/CustomerFeedback';
import { CompetitorIntel } from '../types/CompetitorIntel';
import { UserPersona } from '../types/UserPersona';
import { ResearchDocument } from '../types/ResearchDocument';

// Customer Feedback Service
export const customerFeedbackService = {
  async list(): Promise<CustomerFeedback[]> {
    try {
      const response = await api.get<{ items: CustomerFeedback[] }>('/feedback/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch customer feedback');
    }
  },

  async get(id: number): Promise<CustomerFeedback> {
    try {
      return await api.get<CustomerFeedback>(`/feedback/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch customer feedback');
    }
  },

  async create(data: Partial<CustomerFeedback>): Promise<CustomerFeedback> {
    try {
      return await api.post<CustomerFeedback>('/feedback/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create customer feedback');
    }
  },

  async update(id: number, data: Partial<CustomerFeedback>): Promise<CustomerFeedback> {
    try {
      return await api.put<CustomerFeedback>(`/feedback/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update customer feedback');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/feedback/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete customer feedback');
    }
  },

  async analyzeSentiment(): Promise<any> {
    // Mock AI sentiment analysis
    return { sentiment: 'positive', score: 0.85 };
  },
};

// Competitor Intel Service
export const competitorIntelService = {
  async list(): Promise<CompetitorIntel[]> {
    try {
      const response = await api.get<{ items: CompetitorIntel[] }>('/competitors/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch competitor intel');
    }
  },

  async get(id: number): Promise<CompetitorIntel> {
    try {
      return await api.get<CompetitorIntel>(`/competitors/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch competitor intel');
    }
  },

  async create(data: Partial<CompetitorIntel>): Promise<CompetitorIntel> {
    try {
      return await api.post<CompetitorIntel>('/competitors/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create competitor intel');
    }
  },

  async update(id: number, data: Partial<CompetitorIntel>): Promise<CompetitorIntel> {
    try {
      return await api.put<CompetitorIntel>(`/competitors/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update competitor intel');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/competitors/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete competitor intel');
    }
  },

  async analyzeCompetitor(competitorId: number): Promise<any> {
    // Mock AI competitor analysis
    return { analysis: 'AI competitor analysis' };
  },
};

// User Persona Service
export const userPersonaService = {
  async list(): Promise<UserPersona[]> {
    try {
      const response = await api.get<{ items: UserPersona[] }>('/personas/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch user personas');
    }
  },

  async get(id: number): Promise<UserPersona> {
    try {
      return await api.get<UserPersona>(`/personas/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch user persona');
    }
  },

  async create(data: Partial<UserPersona>): Promise<UserPersona> {
    try {
      return await api.post<UserPersona>('/personas/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create user persona');
    }
  },

  async update(id: number, data: Partial<UserPersona>): Promise<UserPersona> {
    try {
      return await api.put<UserPersona>(`/personas/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update user persona');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/personas/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete user persona');
    }
  },

  async enhancePersona(personaId: number): Promise<any> {
    // Mock AI persona enhancement
    return { enhanced: true };
  },
};

// Research Document Service
export const researchDocumentService = {
  async list(): Promise<ResearchDocument[]> {
    try {
      const response = await api.get<{ items: ResearchDocument[] }>('/research/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch research documents');
    }
  },

  async get(id: number): Promise<ResearchDocument> {
    try {
      return await api.get<ResearchDocument>(`/research/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch research document');
    }
  },

  async create(data: Partial<ResearchDocument>): Promise<ResearchDocument> {
    try {
      return await api.post<ResearchDocument>('/research/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create research document');
    }
  },

  async update(id: number, data: Partial<ResearchDocument>): Promise<ResearchDocument> {
    try {
      return await api.put<ResearchDocument>(`/research/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update research document');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/research/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete research document');
    }
  },
};

// Gemini Chat Service
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: string[]; // Base64 encoded images
  timestamp?: Date;
}

export interface ChatResponse {
  message: string;
  model: string;
  sentiment_score?: number;
  trend_score?: number;
  keywords?: string[];
  overall_score?: number;
}

export const geminiChatService = {
  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[] = [], 
    images: string[] = []
  ): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/research/chat/', {
        message,
        images,
        conversation_history: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to send chat message');
    }
  },
};

