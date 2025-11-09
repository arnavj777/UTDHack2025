import { api, ApiError } from './api';
import { Roadmap } from '../types/Roadmap';
import { BacklogItem } from '../types/BacklogItem';
import { PRDDocument } from '../types/PRDDocument';
import { Sprint } from '../types/Sprint';

// Roadmap Service
export const roadmapService = {
  async list(): Promise<Roadmap[]> {
    try {
      const response = await api.get<Roadmap[]>('/roadmap/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch roadmaps');
    }
  },

  async get(id: number): Promise<Roadmap> {
    try {
      return await api.get<Roadmap>(`/roadmap/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch roadmap');
    }
  },

  async create(data: Partial<Roadmap>): Promise<Roadmap> {
    try {
      return await api.post<Roadmap>('/roadmap/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create roadmap');
    }
  },

  async update(id: number, data: Partial<Roadmap>): Promise<Roadmap> {
    try {
      return await api.put<Roadmap>(`/roadmap/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update roadmap');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/roadmap/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete roadmap');
    }
  },
};

// Backlog Item Service
export const backlogItemService = {
  async list(): Promise<BacklogItem[]> {
    try {
      const response = await api.get<{ items: BacklogItem[] }>('/backlog/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch backlog items');
    }
  },

  async get(id: number): Promise<BacklogItem> {
    try {
      return await api.get<BacklogItem>(`/backlog/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch backlog item');
    }
  },

  async create(data: Partial<BacklogItem>): Promise<BacklogItem> {
    try {
      return await api.post<BacklogItem>('/backlog/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create backlog item');
    }
  },

  async update(id: number, data: Partial<BacklogItem>): Promise<BacklogItem> {
    try {
      return await api.put<BacklogItem>(`/backlog/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update backlog item');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/backlog/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete backlog item');
    }
  },

  async generateAcceptanceCriteria(storyId: number): Promise<string[]> {
    // Mock AI generation
    return ['Acceptance criteria 1', 'Acceptance criteria 2'];
  },

  async aiPrioritize(): Promise<any> {
    // Mock AI prioritization
    return { prioritized: true };
  },
};

// PRD Document Service
export const prdDocumentService = {
  async list(): Promise<PRDDocument[]> {
    try {
      const response = await api.get<{ items: PRDDocument[] }>('/prd/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch PRD documents');
    }
  },

  async get(id: number): Promise<PRDDocument> {
    try {
      return await api.get<PRDDocument>(`/prd/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch PRD document');
    }
  },

  async create(data: Partial<PRDDocument>): Promise<PRDDocument> {
    try {
      return await api.post<PRDDocument>('/prd/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create PRD document');
    }
  },

  async update(id: number, data: Partial<PRDDocument>): Promise<PRDDocument> {
    try {
      return await api.put<PRDDocument>(`/prd/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update PRD document');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/prd/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete PRD document');
    }
  },

  async fillSections(prdId: number, section: string): Promise<string> {
    // Mock AI section filling
    return 'AI generated content for section';
  },
};

// Sprint Service
export const sprintService = {
  async list(): Promise<Sprint[]> {
    try {
      const response = await api.get<{ items: Sprint[] }>('/sprint/');
      return response.items || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch sprints');
    }
  },

  async get(id: number): Promise<Sprint> {
    try {
      return await api.get<Sprint>(`/sprint/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch sprint');
    }
  },

  async create(data: Partial<Sprint>): Promise<Sprint> {
    try {
      return await api.post<Sprint>('/sprint/', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create sprint');
    }
  },

  async update(id: number, data: Partial<Sprint>): Promise<Sprint> {
    try {
      return await api.put<Sprint>(`/sprint/${id}/`, data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update sprint');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/sprint/${id}/`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete sprint');
    }
  },

  async generatePlan(sprintId: number): Promise<any> {
    // Mock AI sprint planning
    return { plan: 'AI generated sprint plan' };
  },
};

