import { is_logged_in } from "$src/utils/user";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
    return {
        is_logged_in: is_logged_in(cookies),
    }
};