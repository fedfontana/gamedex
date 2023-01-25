import prisma from "$src/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = parseInt(params.id);
        const old_dlc = await prisma.dLC.delete({
            where: {
                id,
            }
        });
        return new Response(JSON.stringify({ id: old_dlc.id }));
    } catch(err) {
        console.error("Error in delete DLC: ", err);
        throw error(400, { message: "Error while deleting the DLC" });
    }
}