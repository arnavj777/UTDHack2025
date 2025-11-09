export interface AIInsight {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  insight_type: string;
  narrative?: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

