import { DLCSchema } from "$models/DLC";
import { GameEventsSchema } from "$models/GameEvents";
import { NoteSchema } from "$models/Note";
import { UsefulLinkSchema } from "$models/UsefulLinks";
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
            });
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
    },

    link: async ({ cookies, request }) => {
        if (!is_logged_in(cookies)) {
            throw error(401, "Unauthorized");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            const link = UsefulLinkSchema.parse(formData);
            const new_link = await prisma.usefulLink.create({
                data: link,
            })
            return {
                db_values: new_link,
            }
        } catch (err) {
            if (err instanceof ZodError) {
                console.error("Field errors from create useful link being returned to the client: ", err.flatten());
                return fail(400, {
                    errors: err.flatten().fieldErrors,
                });
            }

            return fail(400, {
                form_errors: ["An unkown error occurred while saving the link"],
            });
        }
    },

    events: async ({ cookies, request }) => {
        if (!is_logged_in(cookies)) {
            throw error(401, "Unauthorized");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            const event = GameEventsSchema.parse(formData);
            const new_event = await prisma.gameEvent.create({
                data: event,
            });
            return {
                db_values: new_event,
            }
        } catch (err) {
            if (err instanceof ZodError) {
                console.error("Field errors from create event being returned to the client: ", err.flatten());
                return fail(400, {
                    errors: err.flatten().fieldErrors,
                });
            }

            return fail(400, {
                form_errors: ["An unkown error occurred while saving the event"],
            });
        }
    },

    dlc: async ({ cookies, request }) => {
        if (!is_logged_in(cookies)) {
            throw error(401, "Unauthorized");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            const dlc = DLCSchema.parse(formData);
            const new_dlc = await prisma.dLC.create({
                data: dlc,
            });
            return {
                db_values: new_dlc,
            }
        } catch (err) {
            if (err instanceof ZodError) {
                console.error("Field errors from create dlc being returned to the client: ", err.flatten());
                return fail(400, {
                    errors: err.flatten().fieldErrors,
                });
            }

            return fail(400, {
                form_errors: ["An unkown error occurred while saving the dlc"],
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