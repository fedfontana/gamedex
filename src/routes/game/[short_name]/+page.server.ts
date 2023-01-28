import { NoteSchema } from "$models/Note";
import prisma from "$src/db";
import { is_logged_in } from "$src/utils/user";
import type { FieldErrors } from "$types/types";
import { error, fail, type Actions } from "@sveltejs/kit";
import { ZodError } from "zod";

export const actions: Actions = {
    note: async ({ cookies, request }) => {
        if (!is_logged_in(cookies)) {
            throw error(401, "Unauthorized");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            const note = NoteSchema.parse(formData);
            const new_note = await prisma.note.create({
                data: note,
            })
            console.log("Returning success")
            return {
                db_values: new_note,
            }
        } catch (err) {
            if (err instanceof ZodError) {
                console.error("Field errors from create note being returned to the client: ", err.flatten());
                return fail(400, {
                    errors: err.flatten().fieldErrors,
                });
            }

            return fail(400, {
                form_errors: ["An unkown error occurred while saving the note"],
            });
        }
    }
};

export type DexFormErrors = {
    errors?: FieldErrors,
    form_errors?: string[]
}

// export type CreateNoteFormResponse = {
//     success: true,
//     db_values: Note,
//     values: {
//         [k: string]: FormDataEntryValue,
//     },
// } | {
//     success: false,
//     values: {
//         [k: string]: FormDataEntryValue,
//     },
//     errors?: FieldErrors,
//     form_errors?: string[]
// }