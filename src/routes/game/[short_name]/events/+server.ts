import { GameEventsSchema } from "$models/GameEvents";
import prisma from "$src/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    try {
        console.log("body of the request: ", body);
        const event = GameEventsSchema.parse(body);
        console.log("event after parsing: ", event);

        const new_event = await prisma.gameEvent.create({
            data: event,
        });
        return new Response(JSON.stringify(new_event));
    } catch(err) {
        // INFO: Prisma error code: P2025 - Record to delete does not exist
        // TODO handle specific errors
        throw error(400, { message: "Bad request" });
    }
}