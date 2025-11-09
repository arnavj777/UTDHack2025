export interface MarketSizing {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  data?: Record<string, any>;
  tam?: number;
  sam?: number;
  som?: number;
  created_at: string;
  updated_at: string;
}

