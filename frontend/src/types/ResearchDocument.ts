export interface ResearchDocument {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  document_type: string;
  content?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

