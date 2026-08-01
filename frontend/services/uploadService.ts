import { apiRequest } from './apiClient';

export async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiRequest<{ file_path: string }>('/api/upload', {
    method: 'POST',
    body: formData,
  }, token);
  return response.file_path;
}
