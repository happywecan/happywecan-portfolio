export type EditorialCopy = Record<string, unknown>;

export function editorialText(copy: EditorialCopy | undefined, key: string, fallback: string) {
  const value = copy?.[key];
  return typeof value === "string" ? value : fallback;
}
