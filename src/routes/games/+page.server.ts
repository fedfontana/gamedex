import prisma from "$src/db"
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const GAMES_PER_PAGE = 30;

export const load: PageServerLoad = async () => {
    return {
        games: await prisma.game.findMany({ take: GAMES_PER_PAGE }),
    }
}


import { z, ZodError } from 'zod';

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

const FilterSortSchema = z.object({
    query: z.preprocess(
        v => {
            if(typeof v === 'string') {
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
    sort_col: z.string().trim().nullish(),
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
            if(typeof v === 'string') {
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
            if(typeof v === 'string') {
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
        console.log("Form data: ",formData);
        try { 
            const options = FilterSortSchema.parse(formData);
            console.log("parsed options: ", options);
        } catch(err) {
            if(err instanceof ZodError) {
                console.error("Zod error: ", err);
            }
        }
    }
};