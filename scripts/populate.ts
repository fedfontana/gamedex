// https://www.kaggle.com/datasets/gregorut/videogamesales

import prisma from "../src/db.js";
import * as fs from "fs";
import { parse } from "csv-parse";
import { type Platform, STATUSES, type Game, type Status } from '../src/models/Game.js'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index.js";

type GameEntry = {
    Rank: number,
    Name: string,
    Platform: string,
    Year: number,
    Publisher: string,
    NA_Sales: number,
    EU_Sales: number,
    JP_Sales: number,
    Other_Sales: number,
    Global_Sales: number,
}

async function main() {
    const data: GameEntry[] = [];

    fs.createReadStream("./scripts/vgsales.csv")
        .pipe(
            parse({
                delimiter: ",",
                columns: true,
                ltrim: true,
            })
        ).on("data", (row) => {
            data.push(row as GameEntry);
        })
        .on("error", (error) => {
            console.log("Csv error: ", error.message);
        })
        .on("end", async () => {
            console.log("Finished parsing data");

            const sizes = ["100", "150", "200", "300", "400", "500", "800"];
            const games = data.map(entry => {
                const w = sizes[Math.floor(Math.random() * sizes.length)];
                const h = sizes[Math.floor(Math.random() * sizes.length)];

                const total_achievements = Math.floor(Math.random() * 80);
                const game: Game = {
                    name: entry.Name.substring(0, 128),
                    short_name: entry.Name.replace(' ', '_').toLowerCase().substring(0, 64),
                    release_date: new Date(entry.Year),
                    art_url: `https://picsum.photos/${w}/${h}`,
                    developer: entry.Publisher,
                    status: STATUSES[Math.floor(Math.random() * STATUSES.length)] as Status,
                    platform: entry.Platform as Platform, // Not really true, but idc
                    play_time: Math.floor(Math.random() * 200),
                    total_achievements,
                    obtained_achievements: Math.floor(Math.random() * total_achievements),
                    completion_percentage: Math.floor(Math.random() * 100),
                };
                return game;
            });

            games.forEach(async game => {
                try {
                    await prisma.game.create({
                        data: game,
                    });
                } catch (err) {
                    if (err instanceof PrismaClientKnownRequestError) {
                        if (err.code === 'P2002') {
                            console.error("Unique constraint error. Skipping entry with name: ", game.name);
                        } else {
                            console.error("DB error. Skipping entry with name: ", game.name);
                        }
                    } else {
                        console.error("Error. Skipping entry with name: ", game.name, "\nError:", err);
                    }
                }
            })
        });
}

await main();