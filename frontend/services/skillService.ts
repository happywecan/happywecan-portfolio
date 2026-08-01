import { apiRequest } from './apiClient';

export interface Skill {
  id?: string;
  _id?: string;
  main: string;
  icon: string;
  subSkills: string[];
}

type SkillPayload = Omit<Skill, 'id' | '_id'>;

export const getSkills = () => apiRequest<Skill[]>('/api/skills');
export const createSkill = (skill: SkillPayload, token: string) =>
  apiRequest<Skill>('/api/skills', { method: 'POST', body: JSON.stringify(skill) }, token);
export const updateSkill = (id: string, skill: SkillPayload, token: string) =>
  apiRequest<Skill>(`/api/skills/${id}`, { method: 'PUT', body: JSON.stringify(skill) }, token);
export const deleteSkill = (id: string, token: string) =>
  apiRequest<void>(`/api/skills/${id}`, { method: 'DELETE' }, token);
