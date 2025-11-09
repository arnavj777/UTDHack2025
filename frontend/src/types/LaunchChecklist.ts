export interface LaunchChecklist {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  status: string;
  items?: any[];
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

