import { UsefulLinkSchema } from "$models/UsefulLinks";
import prisma from "$src/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    try {
        const link = UsefulLinkSchema.parse(body);
        const new_link = await prisma.usefulLink.create({
            data: link,
        });
        return new Response(JSON.stringify(new_link));
    } catch(err) {
        // TODO handle 
        // TODO handle specific errors
        throw error(400, { message: "Bad request" });
    }
}