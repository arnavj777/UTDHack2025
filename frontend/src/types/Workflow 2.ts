export interface Workflow {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  status: string;
  triggers?: any[];
  actions?: any[];
  created_at: string;
  updated_at: string;
}

