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

        return new Response(
            JSON.stringify(
                await get_full_events_for_month(options.year, options.month)
            )
        );
    } catch (err) {
        if (err instanceof ZodError) {
            throw error(400, "Bad request");
        }
        throw error(500, "Could not fetch events for the month");
    }
}

export async function get_full_events_for_month(year: number, month: number) {
    const start_dt = new Date(year, month);
    // month in the date constructor is the 0-based index of the month in the year
    const end_dt = month === 12 ? new Date(year + 1, 0) : new Date(year, month - 1);
    try {

        const games = await prisma.game.findMany({
            where: {
                AND: [
                    {
                        release_date: {
                            lte: start_dt,
                        },
                    },
                    {
                        release_date: {
                            gt: end_dt,
                        },
                    },
                ],
            },
        });
        console.log("Got ", games.length, "games");
        const dlcs = await prisma.dLC.findMany({
            where: {
                AND: [
                    {
                        release_date: {
                            lte: start_dt,
                        },
                    },
                    {
                        release_date: {
                            gt: end_dt,
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
                            gt: end_dt,
                        },
                    },
                    {
                        end_dt: {
                            lte: start_dt,
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
                            gt: end_dt,
                        },
                    },
                    {
                        end_dt: {
                            lte: start_dt,
                        }
                    },
                ],
            },
        });

        const res: CalendarMonthEvent[] = [
            ...games.map(g => {
                console.log("Game with name: ", g.name);
                return <CalendarMonthEvent>{
                    type: "game",
                    data: g
                };
            }),
            ...dlcs.map(dlc => {
                console.log("DLC with name: ", dlc.name);
                return <CalendarMonthEvent>{
                    type: "DLC",
                    data: dlc
                };
            }),
            ...game_events.map(ge => {
                console.log("GameEvent with name: ", ge.name);
                return <CalendarMonthEvent>{
                    type: "game_event",
                    data: ge
                };
            }),
            ...events.map(e => {
                console.log("Event with name: ", e.name);
                return <CalendarMonthEvent>{
                    type: "event",
                    data: e
                };
            }),
        ];
        return res;
    } catch (err) {
        throw error(500, "Could not fetch events");
    }
}