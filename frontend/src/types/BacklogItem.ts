export interface BacklogItem {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  status: string;
  priority: string;
  story_points: number;
  acceptance_criteria?: string[];
  created_at: string;
  updated_at: string;
}

