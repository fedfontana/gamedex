import { Game } from "$models/Game";
import type { Actions } from "@sveltejs/kit";
import { ZodError } from "zod";
import prisma from "$db";
import { Prisma } from "@prisma/client";

export const actions: Actions = {
	default: async ({ request }): Promise<CreateGameFormResponse> => {
		const formData = Object.fromEntries(await request.formData());
		console.log("Form data: ", formData);

		try {
			const game = Game.parse(formData);
			const new_game = await prisma.game.create({
				data: game,
			});
			console.log("Created game: ", new_game);

			return {
				values: formData,
				errors: {},
			}
		} catch (err) {
			//console.error("Kwestho e' errore", err);
			if (err instanceof ZodError) {
				console.error(err.flatten());
				return {
					values: formData,
					errors: err.flatten().fieldErrors,
				}
			} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code === 'P2002') {
					const conflicting_row = err.meta?.target as string | undefined;
					const conflict_msg = conflicting_row ? (
						`Could not create the game beacuse a game with the same value for "${conflicting_row.replace("_key", "").replace("Game_", "").replace("_", " ")}" already exists`
					) : "There was a conflict inserting the game.";
					return {
						values: formData,
						errors: {},
						form_errors: [conflict_msg],
					}
				}
			}
			return {
				values: formData,
				errors: {},
				form_errors: ["An unkown error occurred while saving the game"],
			}
		}
	},
};

export type CreateGameFormResponse = {
	values: {
		[k: string]: FormDataEntryValue,
	},
	errors: ReturnType<ZodError["flatten"]>["fieldErrors"],
	form_errors?: string[]
}