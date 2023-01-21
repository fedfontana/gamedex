import { Game } from "$models/Game";
import type { Actions } from "@sveltejs/kit";
import { ZodError } from "zod";

export const actions: Actions = {
	default: async ({ request }): Promise<CreateGameFormResponse> => {
		const formData = Object.fromEntries(await request.formData());
		console.log(formData);

		try {
			const game = Game.parse(formData);

			return {
				values: formData,
				errors: {},
			}
		} catch (err) {
			if (err instanceof ZodError) {
				console.error(err.flatten());
				return {
					values: formData,
					errors: err.flatten().fieldErrors,
				}
			}
			return {
				values: formData,
				errors: {},
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