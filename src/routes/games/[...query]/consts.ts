import type { Options } from "./utils";

export const DEFAULT_OPTIONS: Options = {
    query: null,
    sort_enabled: false,
    sort_col: 'name',
    sort_ascending: false,
    show_filters: false,
    show_status_filters: false,
    status_filters: [],
    show_platform_filters: false,
    platform_filters: [],
};
export const GAMES_PER_PAGE = 30;
export const SORT_COLS = ['name', 'release_date', 'play_time'] as const;
export type SortCol = (typeof SORT_COLS)[number];