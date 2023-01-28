import { z } from 'zod';

export const UsefulLinkSchema = z.object({
    gameId: z.preprocess(
        v => {
            if(typeof v === "number") return v;
            if(typeof v === "string") return parseInt(v);
            return "";
        },
        z.number().int(),
    ),
    title: z
        .string()
        .min(1, "Each title must contain at least 1 character")
        .max(128, "Each title may contain a max amount of 128 characters"),
    url: z
        .string()
        .url("url must be a valid URL")
        .min(1, "Each url must contain at least 1 character")
        .max(256, "Each url may contain a max amount of 256 characters"),
});
export type Note = z.infer<typeof UsefulLinkSchema>;
