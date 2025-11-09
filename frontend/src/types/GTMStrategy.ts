export interface GTMStrategy {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  status: string;
  launch_date?: string;
  created_at: string;
  updated_at: string;
}

