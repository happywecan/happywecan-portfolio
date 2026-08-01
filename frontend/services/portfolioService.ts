import { apiRequest } from './apiClient';
import type { PortfolioItem, PortfolioLink } from '@/types/api';

export interface PortfolioPayload {
  title: string;
  description: string;
  image_url?: string;
  content?: string;
  github_url?: string;
  demo_url?: string;
  links?: PortfolioLink[];
  tags?: string[];
}

export function getPortfolioItems(): Promise<PortfolioItem[]> {
  return apiRequest<PortfolioItem[]>('/api/portfolio');
}

export function createPortfolioItem(
  item: PortfolioPayload,
  token: string,
): Promise<PortfolioItem> {
  return apiRequest<PortfolioItem>('/api/portfolio', {
    method: 'POST',
    body: JSON.stringify(item),
  }, token);
}

export function updatePortfolioItem(
  id: string,
  item: PortfolioPayload,
  token: string,
): Promise<PortfolioItem> {
  return apiRequest<PortfolioItem>(`/api/portfolio/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }, token);
}

export async function deletePortfolioItem(id: string, token: string): Promise<boolean> {
  await apiRequest<void>(`/api/portfolio/${id}`, { method: 'DELETE' }, token);
  return true;
}
