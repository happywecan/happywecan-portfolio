import { apiRequest } from './apiClient';

export interface Hobby {
  id?: string;
  _id?: string;
  name: string;
  icon: string;
  description?: string;
}

type HobbyPayload = Omit<Hobby, 'id' | '_id'>;

export const getHobbies = () => apiRequest<Hobby[]>('/api/hobbies');
export const createHobby = (hobby: HobbyPayload, token: string) =>
  apiRequest<Hobby>('/api/hobbies', { method: 'POST', body: JSON.stringify(hobby) }, token);
export const updateHobby = (id: string, hobby: HobbyPayload, token: string) =>
  apiRequest<Hobby>(`/api/hobbies/${id}`, { method: 'PUT', body: JSON.stringify(hobby) }, token);
export const deleteHobby = (id: string, token: string) =>
  apiRequest<void>(`/api/hobbies/${id}`, { method: 'DELETE' }, token);
