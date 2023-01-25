import { z } from 'zod';
import { STATUSES } from './Game';

export const DLCSchema = z.object({
    gameId: z.number().int(),
    name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .max(128, "Name must be shorter thant 128 characters")
        .trim(),
    release_date: z.preprocess(
        v => v === "" ? null : v,
        z.coerce.date().nullable()
    ),
    status: z.enum(STATUSES),
});

export type DLC = z.infer<typeof DLCSchema>;