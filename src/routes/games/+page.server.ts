import type { Actions } from "@sveltejs/kit";
import { ZodError } from 'zod';
import type { PageServerLoad } from "./$types";
import { DEFAULT_OPTIONS, FilterSortSchema, load_games_paginated } from "./utils";

export const load: PageServerLoad = async () => {
    return await load_games_paginated(DEFAULT_OPTIONS, 1);
}

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());
        try {
            const options = FilterSortSchema.parse(formData);
            return await load_games_paginated(options)
        } catch (err) {
            // No need to return old values since they're bound in a form variable
            if (err instanceof ZodError) {
                console.error("Zod error: ", err);
            }
        }
    }
};