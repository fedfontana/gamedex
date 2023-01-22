import prisma from "$src/db";
import { is_logged_in } from "$src/utils/user";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, cookies }) => {
    if(!is_logged_in(cookies)) {
        throw error(401, "Unauthorized");
    }
    
    const game = await prisma.game.delete({
        where: {
            short_name: params.short_name,
        }
    });
    console.log("Deleted game with short name: ", params.short_name, " ==> ", game);
    return new Response()
}