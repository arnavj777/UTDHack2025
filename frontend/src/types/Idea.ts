export interface Idea {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  status: string;
  tags?: string[];
  impact_score: number;
  effort_score: number;
  created_at: string;
  updated_at: string;
}

