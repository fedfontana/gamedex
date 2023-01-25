import { GameEventsSchema } from "$models/GameEvents";
import prisma from "$src/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    try {
        const event = GameEventsSchema.parse(body);
        const new_event = await prisma.gameEvent.create({
            data: event,
        });
        return new Response(JSON.stringify(new_event));
    } catch(err) {
        // INFO: Prisma error code: P2025 - Record to delete does not exist
        // TODO handle 
        // TODO handle specific errors
        throw error(401, { message: "Bad request" });
    }
}