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

export const Game = z.object({
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
    total_achievements: z.number().int().min(0),
    obtained_achievements: z.number().int().min(0),
    completion_percentage: z.number().int().min(0).max(100),
});

// TODO add constraints on obtained achievements === 0 if game is not bought, same for completion % 
// TODO find a way to make total_achievements nullable
// TODO refine obtained achievements < total achievements

export type Game = z.infer<typeof Game>;

// Game = {
//     name: string,
//     short_name: string,
//     art_url: url?,
//     developer: string?,
//     release_date: Date?,
//     status: Status,
//     platform: Platform?,
//     play_time: int
// }