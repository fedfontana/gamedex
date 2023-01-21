import prisma from "$src/db"
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return {
        games: await prisma.game.findMany(),
    }
}