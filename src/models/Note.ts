import { z } from 'zod';

export const NoteSchema = z.object({
    gameId: z.preprocess(
        v => {
            if(typeof v === "number") return v;
            if(typeof v === "string") return parseInt(v);
            return "";
        },
        z.number().int(),
    ),
    content: z.string().min(1, "Each note must contain at least 1 character").max(512, "Each note may contain a max amount of 512 characters"),
});
export type Note = z.infer<typeof NoteSchema>;
