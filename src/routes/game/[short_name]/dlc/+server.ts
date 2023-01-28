import { DLCSchema } from "$models/DLC";
import prisma from "$src/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    try {
        const dlc = DLCSchema.parse(body);
        const new_dlc = await prisma.dLC.create({
            data: dlc,
        });
        return new Response(JSON.stringify(new_dlc));
    } catch(err) {
        // TODO handle specific errors
        throw error(400, { message: "Bad request" });
    }
}