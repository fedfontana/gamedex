import prisma from "$src/db"
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z, ZodError } from 'zod';

const GAMES_PER_PAGE = 30;

export const load: PageServerLoad = async () => {
    return {
        games: await prisma.game.findMany({ take: GAMES_PER_PAGE }),
    }
}



// Form data:  {
//     query: 'ciao',
//     sort_enabled: 'true',
//     sort_ascending: 'true',
//     sort_col: 'release date',
//     show_filters: 'true',
//     show_status_filters: 'true',
//     status_filters: 'watchlist,playing',
//     show_platform_filters: 'true',
//     platform_filters: 'PS4'
// }

const SORT_COLS = ['name', 'release_date', 'play_time'] as const;
type SortCol = (typeof SORT_COLS)[number];

// TODO refine type of filters
const FilterSortSchema = z.object({
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
                return v.split(',').map(e => e.trim())
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
                return v.split(',').map(e => e.trim()).filter(e => e.length > 0)
            }
            return [];
        },
        z.array(z.string())
    ),
});

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());
        console.log("Form data: ", formData);
        try {
            const options = FilterSortSchema.parse(formData);
            console.log("parsed options: ", options);

            const sort_options: { [k in SortCol]?: 'asc' | 'desc' } = {};
            if (options.sort_enabled) {
                sort_options[options.sort_col ?? 'name'] = options.sort_ascending ? 'asc' : 'desc';
            }

            //console.log("Sort options: ", sort_options);

            const games = await prisma.game.findMany({
                take: GAMES_PER_PAGE,
                orderBy: sort_options,
            });

            console.log("Returning: ", games);

            return {
                games,
            }

        } catch (err) {
            if (err instanceof ZodError) {
                console.error("Zod error: ", err);
            }
        }
    }
};