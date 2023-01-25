import { z } from 'zod';

export const UsefulLinkSchema = z.object({
    gameId: z.number().int(),
    title: z
        .string()
        .min(0, "Each title must contain at least 1 character")
        .max(128, "Each title may contain a max amount of 128 characters"),
    url: z
        .string()
        .url("url must be a valid URL")
        .min(0, "Each url must contain at least 1 character")
        .max(256, "Each url may contain a max amount of 256 characters"),
});
export type Note = z.infer<typeof UsefulLinkSchema>;
