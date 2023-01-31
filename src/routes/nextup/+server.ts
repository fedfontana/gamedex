import prisma from "$src/db";
import { error, type RequestHandler } from "@sveltejs/kit";
import z, { ZodError } from 'zod'
import type { CalendarMonthEvent } from "./types";

const ReqSchema = z.object({
    month: z.preprocess(
        v => typeof v === "string" ? parseInt(v) : v,
        z.number().int().min(1).max(12),
    ),
    year: z.preprocess(
        v => typeof v === "string" ? parseInt(v) : v,
        z.number().int().nonnegative(),
    ),
})

export const GET: RequestHandler = async ({ url }) => {
    const req = {
        month: url.searchParams.get("month"),
        year: url.searchParams.get("year"),
    }
    try {
        const options = ReqSchema.parse(req);
        const start_dt = new Date(options.year, options.month);
        // month in the date constructor is the 0-based index of the month in the year
        const end_dt = options.month === 12 ? new Date(options.year + 1, 0) : new Date(options.year, options.month - 1);
        const games = await prisma.game.findMany({
            where: {
                AND: [
                    {
                        release_date: {
                            gte: start_dt,
                        },
                    },
                    {
                        release_date: {
                            lt: end_dt,
                        },
                    },
                ],
            },
        });
        const dlcs = await prisma.dLC.findMany({
            where: {
                AND: [
                    {
                        release_date: {
                            gte: start_dt,
                        },
                    },
                    {
                        release_date: {
                            lt: end_dt,
                        },
                    },
                ],
            },
        });
        const game_events = await prisma.gameEvent.findMany({
            where: {
                OR: [
                    {
                        begin_dt: {
                            lt: end_dt,
                        },
                    },
                    {
                        end_dt: {
                            gte: start_dt,
                        }
                    },
                ],
            },
        });
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    {
                        begin_dt: {
                            lt: end_dt,
                        },
                    },
                    {
                        end_dt: {
                            gte: start_dt,
                        }
                    },
                ],
            },
        });

        const res: CalendarMonthEvent[] = [
            ...games.map(g => {
                return <CalendarMonthEvent>{
                    type: "game",
                    data: g
                };
            }),
            ...dlcs.map(dlc => {
                return <CalendarMonthEvent>{
                    type: "DLC",
                    data: dlc
                };
            }),
            ...game_events.map(ge => {
                return <CalendarMonthEvent>{
                    type: "game_event",
                    data: ge
                };
            }),
            ...events.map(e => {
                return <CalendarMonthEvent>{
                    type: "event",
                    data: e
                };
            }),
        ];

        return new Response(JSON.stringify(res));
    } catch (err) {
        if (err instanceof ZodError) {
            throw error(400, "Bad request");
        }
        throw error(500, "Could not fetch events for the month");
    }
}