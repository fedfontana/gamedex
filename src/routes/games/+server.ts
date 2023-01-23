import { error, type RequestHandler } from "@sveltejs/kit";
import { ZodError } from "zod";
import { DEFAULT_OPTIONS, FilterSortSchema, load_games_paginated } from "./utils";

export const GET: RequestHandler = async ({ url }) => {
    const page = parseInt(url.searchParams.get('page') ?? '0');
    if (isNaN(page)) throw error(401, { message: "Bad request, cannot cast page to integer" });

    const encoded_options = url.searchParams.get('options');

    try {
        const options = encoded_options ? 
            FilterSortSchema.parse(
                JSON.parse(
                    decodeURIComponent(encoded_options)
                    )
                ) 
            : DEFAULT_OPTIONS;
        if(encoded_options) {
            console.log("DECODODE DEEZ NUTZ: ", options);
        }
        return new Response(JSON.stringify(await load_games_paginated(options, page)));
    } catch (err) {
        if (err instanceof ZodError) {
            console.error("Zod error: ", err);
            throw error(401, { message: err.message })
        }
        throw error(401, { message: "Bad request" })
    }
}