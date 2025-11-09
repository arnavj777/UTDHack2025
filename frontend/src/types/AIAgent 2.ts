export interface AIAgent {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  agent_type: string;
  status: string;
  configuration?: Record<string, any>;
  autonomy_level: number;
  created_at: string;
  updated_at: string;
}

