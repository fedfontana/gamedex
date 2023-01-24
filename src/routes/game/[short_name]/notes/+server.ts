import { NoteSchema } from "$models/Note";
import prisma from "$src/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    try {
        const note = NoteSchema.parse(body);
        const new_note = await prisma.note.create({
            data: note,
        });
        return new Response(JSON.stringify(new_note));
    } catch(err) {
        // TODO handle 
        // TODO handle specific errors
        throw error(401, { message: "Bad request" });
    }
}