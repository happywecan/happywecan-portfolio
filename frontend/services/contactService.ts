import { API_BASE_URL } from './authService';

export interface ContactItem {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
  replied: boolean;
}

export async function getContactsAdmin(token: string): Promise<ContactItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/contacts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch contacts' }));
    throw new Error(errorData.detail || 'Failed to fetch contacts');
  }

  return response.json();
}

export async function updateContactStatus(
  id: string,
  updates: { read?: boolean; replied?: boolean },
  token: string
): Promise<ContactItem> {
  const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to update contact status' }));
    throw new Error(errorData.detail || 'Failed to update contact status');
  }

  return response.json();
}
