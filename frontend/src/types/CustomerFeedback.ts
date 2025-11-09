export interface CustomerFeedback {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  source: string;
  sentiment: string;
  rating?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

