export interface Experiment {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  status: string;
  experiment_type: string;
  results?: Record<string, any>;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

