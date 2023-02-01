import type { PageServerLoad } from "./$types";
import { get_full_events_for_month } from "./+server";

export const load: PageServerLoad = async () => {
    const month = (new Date()).getMonth();
    const year = (new Date()).getFullYear();
    const res = await get_full_events_for_month(year, month+1);
    return {
        calendar_events: res,
    };
};