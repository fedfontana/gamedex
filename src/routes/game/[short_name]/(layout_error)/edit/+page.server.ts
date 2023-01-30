import { is_logged_in } from "$src/utils/user";
import { error, fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";
import { GameSchema } from "$models/Game";
import { ZodError } from "zod";
import prisma from "$db";
import { Prisma } from "@prisma/client";
import type { FieldErrors } from "$types/types";


export const load: ServerLoad = async ({ cookies, url }) => {
    if (!is_logged_in(cookies)) {
        // url.pathname === '/games/<short_name>/edit"
        throw redirect(307, `/login?next=${url.pathname}`);
    }
}

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        if (!is_logged_in(cookies)) {
            throw error(401, "Unauthorized");
        }

        const formData = Object.fromEntries(await request.formData());

        try {
            const game = GameSchema.parse(formData);
            await prisma.game.update({
                where: {
                    //TODO handle no game with that short_name
                    short_name: game.short_name,
                },
                data: game,
            });

            return {
                values: formData,
                errors: {},
            }
        } catch (err) {
            if (err instanceof ZodError) {
                return fail(400, {
                    errors: err.flatten().fieldErrors,
                });
            } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    const conflicting_row = err.meta?.target as string | undefined;
                    const conflict_msg = conflicting_row ? (
                        `Could not create the game beacuse a game with the same value for "${conflicting_row.replace("_key", "").replace("Game_", "").replace("_", " ")}" already exists`
                    ) : "There was a conflict inserting the game.";
                    return fail(400, {
                        form_errors: [conflict_msg],
                    });
                }
            }
            return fail(400, {
                form_errors: ["An unkown error occurred while saving the game"],
            });
        }
    },
};

export type EditGameFormResponse = {
    values: {
        [k: string]: FormDataEntryValue,
    },
    errors: FieldErrors,
    form_errors?: string[]
}