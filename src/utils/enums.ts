export const SORT_OPTIONS = ['name', 'release date', 'play time'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];