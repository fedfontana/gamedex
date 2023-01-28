import { z } from 'zod';

export const GameEventsSchema = z.object({
    gameId: z.preprocess(
        v => {
            if (typeof v === "number") return v;
            if (typeof v === "string") return parseInt(v);
            return "";
        },
        z.number().int(),
    ),
    name: z
        .string()
        .min(1, "Each title must contain at least 1 character")
        .max(128, "Each title may contain a max amount of 128 characters"),
    description: z.preprocess(
        v => v === "" ? null : v,
        z.string()
            .min(1, "Each note must contain at least 1 character")
            .max(512, "Each note may contain a max amount of 512 characters")
            .nullable(),
    ),
    begin_dt: z.coerce.date(),
    end_dt: z.preprocess(
        v => v === "" ? null : v,
        z.coerce.date().nullable()
    ),
});

export type Note = z.infer<typeof GameEventsSchema>;
