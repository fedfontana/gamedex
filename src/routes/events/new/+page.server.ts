import { error, fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";
import { ZodError } from "zod";
import prisma from "$db";
import { Prisma } from "@prisma/client";
import { is_logged_in } from "$src/utils/user";
import { EventSchema } from "$models/Event";

export const load: ServerLoad = async ({ cookies, url }) => {
    if (!is_logged_in(cookies)) {
        throw redirect(307, `/login?next=${url.pathname}`);
    }
}

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        if (!is_logged_in(cookies)) {
            throw error(401, "Unauthorized");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            const event = EventSchema.parse(formData);
            await prisma.event.create({
                data: event,
            });

            return {};
        } catch (err) {
            console.error("Error inserting the event: ", err);
            if (err instanceof ZodError) {
                return fail(400, {
                    field_errors: err.flatten().fieldErrors,
                });
            } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    const conflicting_row = err.meta?.target as string | undefined;
                    const conflict_msg = conflicting_row ? (
                        `Could not create the event beacuse an event with the same name already exists`
                    ) : "There was a conflict inserting the game.";
                    return fail(400, {
                        form_errors: [conflict_msg],
                    });
                }
            }
            return fail(400, {
                form_errors: ["An unkown error occurred while saving the event"],
            });
        }
    },
};