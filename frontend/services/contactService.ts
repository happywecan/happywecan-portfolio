import { apiRequest } from './apiClient';

export interface ContactItem {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
  replied: boolean;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  contact_id: string;
}

export function submitContact(data: { name: string; email: string; message: string }) {
  return apiRequest<ContactSubmissionResponse>('/api/contactme', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getContactsAdmin(token: string): Promise<ContactItem[]> {
  return apiRequest<ContactItem[]>('/api/contacts', {}, token);
}

export function updateContactStatus(
  id: string,
  updates: { read?: boolean; replied?: boolean },
  token: string,
): Promise<ContactItem> {
  return apiRequest<ContactItem>(`/api/contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }, token);
}

export function deleteContact(id: string, token: string): Promise<void> {
  return apiRequest<void>(`/api/contacts/${id}`, { method: 'DELETE' }, token);
}
