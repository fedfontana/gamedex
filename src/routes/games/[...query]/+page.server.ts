import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { DEFAULT_OPTIONS } from "./consts";
import { FilterSortSchema, load_games_paginated } from "./utils";

export const load: PageServerLoad = async ({ params }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = (params as any).query as string;
    if(q.length > 0) {
        const options = JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
        options.query = q;
        return await load_games_paginated(options, 1);
    }

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
            return fail(400);
        }
    }
};