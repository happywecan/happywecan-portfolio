import { apiRequest } from './apiClient';
import type { BlogPost } from '@/types/api';

export type BlogPostPayload = Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'published_at'>;

export const getPublishedBlogPosts = () => apiRequest<BlogPost[]>('/api/blog');

export const getBlogPostsAdmin = (token: string) =>
  apiRequest<BlogPost[]>('/api/blog/all', {}, token);

export const createBlogPost = (item: BlogPostPayload, token: string) =>
  apiRequest<BlogPost>('/api/blog', { method: 'POST', body: JSON.stringify(item) }, token);

export const updateBlogPost = (id: string, item: BlogPostPayload, token: string) =>
  apiRequest<BlogPost>(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(item) }, token);

export const deleteBlogPost = (id: string, token: string) =>
  apiRequest<void>(`/api/blog/${id}`, { method: 'DELETE' }, token);
