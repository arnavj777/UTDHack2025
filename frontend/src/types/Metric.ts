export interface Metric {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  metric_type: string;
  value?: number;
  unit?: string;
  date?: string;
  created_at: string;
  updated_at: string;
}

