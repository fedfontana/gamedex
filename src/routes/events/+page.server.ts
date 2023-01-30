import prisma from "$src/db";
import { error, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async () => {
    try {
        const events = await prisma.event.findMany();
        return {
            events
        };
    } catch(err) {
        throw error(500, "Could not fetch events");
    }
}