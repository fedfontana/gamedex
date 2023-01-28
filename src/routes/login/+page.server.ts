import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";
import { ZodError } from "zod";
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { env } from "$env/dynamic/private";
import { is_logged_in } from "$src/utils/user";

const LoginSchema = z.object({
	username: z.string().min(1, "Username must be at least 1 character long").max(64, "Username must be at most 64 characters long").trim(),
	password: z.string().min(1, "Username must be at least 1 character long").max(64, "Username must be at most 64 characters long"),
});

export const load: ServerLoad = async ({ cookies, url }) => {
	if (is_logged_in(cookies)) {
		throw redirect(307, url.searchParams.get('next') ?? '/')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {

		const rFormData = await request.formData();
		const formData = Object.fromEntries(rFormData);

		try {
			const login_data = LoginSchema.parse(formData);

			if (login_data.username !== env.ADMIN_USERNAME || login_data.password !== env.ADMIN_PASSWORD) {
				return fail(401, {
					form_errors: ["Wrong username or password"],
				});
			}

			const default_jwt_duration = 14 * 24 * 60 * 60;

			const token = jwt.sign(
				{ data: { authenticated: true } },
				env.JWT_SECRET,
				{ expiresIn: env.JWT_DURATION ?? default_jwt_duration }
			);

			if (env.NODE_ENV === "production") {
				cookies.set('gamedex_auth_token', token, {
					secure: true,
					maxAge: parseInt(env.JWT_DURATION ?? `${default_jwt_duration}`),
					sameSite: 'strict',
					path: '/',
					// httpOnly: true,
				})
			} else {
				cookies.set('gamedex_auth_token', token, {
					secure: true,
					maxAge: parseInt(env.JWT_DURATION ?? `${default_jwt_duration}`),
					path: '/',
					// httpOnly: true,
				})
			}

			return {};
		} catch (err) {
			if (err instanceof ZodError) {
				return fail(400, {
					errors: err.flatten().fieldErrors,
				});
			}
			return fail(400, {
				form_errors: ["An unkown error occurred while logging you in"],
			});
		}
	},
};

// export type LoginFormResponse = {
// 	values: {
// 		[k: string]: FormDataEntryValue,
// 	},
// 	logged_in: boolean,
// 	errors: ReturnType<ZodError["flatten"]>["fieldErrors"],
// 	form_errors?: string[]
// };