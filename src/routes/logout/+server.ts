import { is_logged_in } from "$src/utils/user";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ cookies }) => {
    if(is_logged_in(cookies)) {
        cookies.delete('gamedex_auth_token');
    }
    return new Response();
}