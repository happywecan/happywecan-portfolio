export interface ApiErrorBody {
  detail?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
}

export interface AdminProfile {
  email: string;
  nickname: string;
}

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
  links?: PortfolioLink[];
  tags: string[];
  created_at: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  cover_image?: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  published_at?: string;
  updated_at?: string;
}
