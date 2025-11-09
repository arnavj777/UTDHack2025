export interface PRDDocument {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  status: string;
  version: number;
  sections?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

