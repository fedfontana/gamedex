import { z } from 'zod';

export const PLATFORMS = [
    'PS5',
    'PS4',
    'PS3',
    'PS2',
    'PS1',
    'PSP',
    'PSVita',
    'XBX',
    'XB1',
    'XB360',
    'Steam',
    'Epic Store',
    'PC',
    'DS',
    '3DS',
    'Switch',
    'Wii',
    'WiiU',
    'GameCube',
    'SNES',
    'NES',
    'GBA',
    'GBC',
    'Nintendo64',
    'iOS',
    'android',
    'Sega Genesis',
    'Atari 2600'
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const STATUSES = [
    'backlog',
    'watchlist',
    'wishlist',
    'retired',
    'playing',
    'paused',
    'finished'
] as const;
export type Status = (typeof STATUSES)[number];

export const GameSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .max(128, "Name must be shorter thant 128 characters")
        .trim(),
    short_name: z
        .string({ required_error: "Short name is required" })
        .min(1, "Short name is required")
        .max(64, "Short name must be shorter than 64 characters")
        .trim(),
    art_url: z.preprocess(
        v => v === "" ? null : v,
        z.string()
            .url("Art url must be a valid URL")
            .max(256, "Art url must be shorter than 256 characters")
            .nullable(),
    ),
    developer: z.preprocess(
        v => v === "" ? null : v,
        z.string()
            .max(128, "Developer must be shorter than 128 characters")
            .trim()
            .nullable(),
    ),
    release_date: z.preprocess(
        v => v === "" ? null : v,
        z.coerce.date().nullable()
    ),
    status: z.enum(STATUSES),
    platform: z.enum(PLATFORMS),
    play_time: z.preprocess(
        v => parseInt(z.string().parse(v), 10),
        z.number({ required_error: "Play time is required" })
            .int("Play time must be an integer")
            .nonnegative("Play time must be greater than 0")
    ),
    total_achievements: z.preprocess(
        v => parseInt(z.string().parse(v), 10),
        z.number({ required_error: "Total achievements is required" })
            .int("Total achievements must be an integer")
            .nonnegative("Total achievements must be greater than 0")
    ),
    obtained_achievements: z.preprocess(
        v => parseInt(z.string().parse(v), 10),
        z.number({ required_error: "Obtained achievements is required" })
            .int("Obtained achievements must be an integer")
            .nonnegative("Obtained achievements must be greater than 0")
    ),
    completion_percentage: 
    z.preprocess(
        v => parseInt(z.string().parse(v), 10),
        z.number({ required_error: "Completion percentage is required" })
            .int("Completion percentage must be an integer")
            .nonnegative("Completion percentage must be greater than 0")
            .max(100, "Completion percentage must be smaller or equal than 100")
    ),
}).superRefine(({total_achievements, obtained_achievements}, ctx) => {
    if(obtained_achievements > total_achievements) {
        ctx.addIssue({
            code: "custom",
            message: "Obtained achievements must be smaller than total achievements",
            path: ["obtained_achievements"]
        });
    }
});

export type Game = z.infer<typeof GameSchema>;