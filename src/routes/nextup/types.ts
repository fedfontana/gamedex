import type { DLC, Game, GameEvent, Event } from "@prisma/client";

// TODO refine these types and return only the data needed to show the relevanta data in the calendar (may need to add stuff to dlc like art_url and name, same for evnet)
export type CalendarGame = Game;
export type CalendarDLC = DLC;
export type CalendarGameEvent = GameEvent;
export type CalendarEvent = Event;
export type CalendarMonthEvent = {
    type: "game",
    data: CalendarGame,
} | {
    type: "DLC",
    data: CalendarDLC
} | {
    type: "game_event",
    data: CalendarGameEvent
} | {
    type: "event",
    data: CalendarEvent
};