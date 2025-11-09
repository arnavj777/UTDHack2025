export interface Roadmap {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

