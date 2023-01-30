import { z } from 'zod';

export const EventSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .max(128, "Name must be shorter thant 128 characters")
        .trim(),
    art_url: z.preprocess(
        v => v || null,
        z.string()
            .url("Art url must be a valid URL")
            .max(256, "Art url must be shorter than 256 characters")
            .nullable(),
    ),
    description: z.preprocess(
        v => v || null,
        z.string()
            .max(512, "Description must be shorter than 512 characters")
            .nullable(),
    ),
    streaming_url: z.preprocess(
        v => v || null,
        z.string()
            .url("Stream url must be a valid URL")
            .max(256, "Stream must be shorter than 256 characters")
            .nullable(),
    ),
    begin_dt: z.coerce.date(),
    end_dt: z.coerce.date(),
});
//TODO refine: begin_dt < end_dt

export type Event = z.infer<typeof EventSchema>;