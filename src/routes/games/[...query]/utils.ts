import prisma from '$src/db';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { GAMES_PER_PAGE, SORT_COLS, type SortCol } from './consts';

// TODO refine type of filters
export const FilterSortSchema = z.object({
    query: z.preprocess(
        v => {
            if (typeof v === 'string') {
                return v.trim() === '' ? null : v.trim()
            }
            return null;
        },
        z.string().nullable(),
    ),
    sort_enabled: z.preprocess(
        v => v === 'true',
        z.boolean(),
    ),
    sort_col: z.preprocess(
        v => {
            if (typeof v === 'string') {
                return v.replace(' ', '_');
            }
            return null;
        },
        z.enum(SORT_COLS).nullish(),
    ),
    sort_ascending: z.preprocess(
        v => v === 'true',
        z.boolean(),
    ),
    show_filters: z.preprocess(
        v => v === 'true',
        z.boolean(),
    ),
    show_status_filters: z.preprocess(
        v => v === 'true',
        z.boolean(),
    ),
    status_filters: z.preprocess(
        v => {
            if (typeof v === 'string') {
                return v.split(',').map(e => e.trim()).filter(e => e.length > 0);
            }
            return [];
        },
        z.array(z.string())
    ),
    show_platform_filters: z.preprocess(
        v => v === 'true',
        z.boolean(),
    ),
    platform_filters: z.preprocess(
        v => {
            if (typeof v === 'string') {
                return v.split(',').map(e => e.trim()).filter(e => e.length > 0);
            }
            return [];
        },
        z.array(z.string())
    ),
});

export type Options = z.infer<typeof FilterSortSchema>;

export async function load_games_paginated(options: Options, page = 1) {
    if(page < 1) throw error(404, { message: "Page must be > 0"});
    
    const sort_options: { [k in SortCol]?: 'asc' | 'desc' } = {};
    if (options.sort_enabled) {
        sort_options[options.sort_col ?? 'name'] = options.sort_ascending ? 'asc' : 'desc';
    }

    const query_options = options.query ? {
        OR: [
            {
                name: { contains: options.query, },
            },
            {
                short_name: { contains: options.query, },
            },
            {
                developer: { contains: options.query, },
            },
        ],
    } : {};

    const status_filters = options.show_status_filters ? {
        status: { in: options.status_filters, },
    } : {};


    const platform_filters = options.show_platform_filters ? {
        platform: { in: options.platform_filters, },
    } : {};

    const games = await prisma.game.findMany({
        orderBy: sort_options,
        skip: GAMES_PER_PAGE * (page-1),
        take: GAMES_PER_PAGE,
        where: { ...query_options, ...status_filters, ...platform_filters },
    });

    //TODO there must be a way to get this info from the previous query
    const total_game_count = await prisma.game.count({
        where: { ...query_options, ...status_filters, ...platform_filters },
    });

    const total_pages = Math.ceil(total_game_count / GAMES_PER_PAGE);    

    return {
        games,
        total_pages,
        page,
        total_game_count,
    };
}