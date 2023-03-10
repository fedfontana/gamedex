import prisma from "$src/db"
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";

export const load: LayoutServerLoad = async ({ params }) => {
    const game = await prisma.game.findUnique({
        where: {
            short_name: params.short_name,
        },
        include: {
            notes: true,
            useful_links: true,
            events: true,
            DLCs: true,
        }
    });

    if (game === null) {
        throw error(404, `Game with short name "${params.short_name}" not found`);
    }
    
    return {
        game,
    }
}