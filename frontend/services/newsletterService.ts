import { apiRequest } from './apiClient';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
  source: string;
}

export interface NewsletterSubscriptionResponse {
  success: boolean;
  message: string;
  subscriber_id: string;
}

export const subscribeNewsletter = (email: string, source = 'frontend_about_page') =>
  apiRequest<NewsletterSubscriptionResponse>('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, source }),
  });

export const getSubscribers = (token: string) =>
  apiRequest<NewsletterSubscriber[]>('/api/subscribers', {}, token);

export const setSubscriberActive = (id: string, active: boolean, token: string) =>
  apiRequest<NewsletterSubscriber>(`/api/subscribers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  }, token);

export const deleteSubscriber = (id: string, token: string) =>
  apiRequest<void>(`/api/subscribers/${id}`, { method: 'DELETE' }, token);
