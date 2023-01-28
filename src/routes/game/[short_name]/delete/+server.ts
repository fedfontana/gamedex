import prisma from "$src/db";
import { is_logged_in } from "$src/utils/user";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, cookies }) => {
    console.log("Hitting the handler tho");
    if(!is_logged_in(cookies)) {
        throw error(401, "Unauthorized");
    }
    
    await prisma.game.delete({
        where: {
            short_name: params.short_name,
        }
    });

    return new Response()
}