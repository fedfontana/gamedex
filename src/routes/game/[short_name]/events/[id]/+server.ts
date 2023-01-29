import prisma from "$src/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = parseInt(params.id);
        const old_event = await prisma.gameEvent.delete({
            where: {
                id,
            }
        });
        return new Response(JSON.stringify({ id: old_event.id }));
    } catch(err) {
        throw error(400, { message: "Error while deleting the event" });
    }
}