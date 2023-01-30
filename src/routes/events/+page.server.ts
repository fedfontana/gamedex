import prisma from "$src/db";
import { error, type Actions, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ url }) => {
    const q = url.searchParams.get("q") ?? "";
    return {
        events: await get_filtered(q, false),
    };
}

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await request.formData();
        const q = (form.get("query") ?? "") as string;
        const show_all = (form.get("show_all") ?? "off") === "on";
        console.log("Firing this with q=", q, " and show_all=", show_all);
        return {
            events: await get_filtered(q, show_all),
        }   
    }
};

async function get_filtered(q: string | undefined, show_all: boolean) {
    try {
        const events = await prisma.event.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: q,
                        }
                    },
                    {
                        end_dt: show_all ? undefined : {
                            gte: new Date(),
                        }
                    }
                ]
            },
            orderBy: {
                begin_dt: 'asc',
            }
        });

        return events;
    } catch (err) {
        console.error("Error while getting events with filters: ", err);
        throw error(500);
    }
}