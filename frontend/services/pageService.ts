import { apiRequest } from "./apiClient";

export type PageBlockType =
  | "editorial" | "hero" | "about" | "skills" | "portfolio" | "blog" | "contact"
  | "rich_text" | "image_text" | "cta" | "spacer";

export type PageBlock = {
  id: string;
  type: PageBlockType;
  enabled: boolean;
  content: Record<string, unknown>;
};

export type CmsPage = {
  id?: string;
  slug: string;
  title: string;
  version: number;
  blocks: PageBlock[];
  updated_at?: string;
};

export const getPage = (slug: string) => apiRequest<CmsPage>(`/api/pages/${slug}`);

export type PageRevision = { version: number; title: string; blocks: PageBlock[]; publishedAt: string };

export const getPageRevisions = (slug: string, token: string) =>
  apiRequest<PageRevision[]>(`/api/pages/${slug}/revisions`, {}, token);

export const restorePage = (slug: string, revision: number, currentVersion: number, token: string) =>
  apiRequest<CmsPage>(`/api/pages/${slug}/restore/${revision}`, {
    method: "POST", body: JSON.stringify({ currentVersion }),
  }, token);

export const updatePage = (slug: string, page: Pick<CmsPage, "title" | "blocks" | "version">, token: string) =>
  apiRequest<CmsPage>(`/api/pages/${slug}`, {
    method: "PUT",
    body: JSON.stringify(page),
  }, token);
