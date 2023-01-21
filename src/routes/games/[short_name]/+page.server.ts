import prisma from "$src/db"
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const game = await prisma.game.findUnique({
        where: {
            short_name: params.short_name,
        },
    });
    console.log("GAME RETURN: ", game);
    if (game === null) {
        throw error(404, {
            message: "No game with that short name found"
        })
    }
    
    return {
        game,
    }
}