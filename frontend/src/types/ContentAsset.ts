export interface ContentAsset {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  content_type: string;
  content?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

