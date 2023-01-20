import { Game } from "$models/Game";
import type { Actions } from "@sveltejs/kit";
import { ZodError } from "zod";

export const actions: Actions = {
	default: async ({ request }) => {
		console.log("Running inside of the handler")
		const formData = Object.fromEntries(await request.formData());
		console.log(formData);

		try {
			const game = Game.parse(formData);
			console.log("Successfully parsed the game as: ", game);
		} catch (err) {
			if (err instanceof ZodError) {
				console.error(err.flatten());
				return {
					values: formData,
					errors: err.flatten().fieldErrors,
				}
			}
		}
	},
};

export type FormFailureResponse = {
	values: {
		[k: string]: FormDataEntryValue,
	},
	errors: ReturnType<ZodError["flatten"]>["fieldErrors"]
}