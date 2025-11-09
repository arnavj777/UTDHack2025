export interface ScenarioPlan {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  scenario_type: string;
  created_at: string;
  updated_at: string;
}

