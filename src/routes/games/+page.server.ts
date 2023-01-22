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
        v => v === 'on',
        z.boolean(),
    ),
    sort_col: z.string().trim().nullish(),
    sort_ascending: z.preprocess(
        v => v === 'on',
        z.boolean(),
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