import { apiRequest, API_BASE_URL } from './apiClient';
import type { AdminProfile, TokenResponse } from '@/types/api';

export { API_BASE_URL };

/**
 * Logs in a user.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns The access token and token type.
 */
export async function login(email: string, password: string) {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  return apiRequest<TokenResponse>('/api/admin/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
}

/**
 * Fetches the current admin user's profile.
 * @param token - The JWT access token.
 * @returns The user's profile information.
 */
export async function getAdminProfile(token: string) {
  return apiRequest<AdminProfile>('/api/admin/me', {}, token);
}
