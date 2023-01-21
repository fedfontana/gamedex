import prisma from "$src/db";
import type { RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params }) => {
    const game = await prisma.game.delete({
        where: {
            short_name: params.short_name,
        }
    });
    console.log("Deleted game with short name: ", params.short_name, " ==> ", game);
    return new Response();
}