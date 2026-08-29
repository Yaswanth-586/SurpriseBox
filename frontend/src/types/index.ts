export interface Surprise {
  public_token: string;
  recipient_name: string;
  title: string;
  creator_name?: string;
  occasion: string;
  occasion_icon?: string;
  greeting?: string;
  unlock_at: string;
  timezone: string;
  theme: string;
  box_style: string;
  is_locked: boolean;
  server_time: string;
  created_at: string;
}

export interface SurpriseContent {
  message?: string; // Legacy
  items: SurpriseItem[];
}

export interface SurpriseItem {
  id?: number;
  type: 'text' | 'letter' | 'photo' | 'video' | 'audio' | 'link';
  title?: string;
  content?: string;
  media_url?: string;
  display_order: number;
}

export interface CreateSurpriseData {
  recipient_name: string;
  title: string;
  creator_name?: string;
  occasion: string;
  occasion_icon?: string;
  greeting?: string;
  message?: string; // Legacy or default
  items: SurpriseItem[];
  unlock_at: string;
  timezone: string;
  theme: string;
  box_style: string;
}

export interface Occasion {
  id: string;
  name: string;
  icon: string;
  default_greeting: string;
  theme?: string;
  decorative_elements?: string[];
}
