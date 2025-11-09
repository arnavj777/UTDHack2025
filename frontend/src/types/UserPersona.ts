export interface UserPersona {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  persona_name?: string;
  demographics?: Record<string, any>;
  behaviors?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

