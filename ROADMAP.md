# Gamedex

Tech stack:
- sveltekit
    - zod
    - typescript
    - tailwind
    - daisy ui
- db
    - mysql
    - local development on docker
    - production hosted on planetscale
    - prisma

## V 0.1.0
- [X] Games
    - [X] Create
    - [X] List
    - [X] Delete
    - [X] select a single one

## V 0.2.0
- [X] single user login with jwt
- [X] edit games
  - [X] same component as add game
  
## V 0.3.0
- [X] theme switch
  - [X] change its location
- [X] filter list
- [X] sort list
- [X] paginated list result
- [X] working search box in home
- [X] less ugly home page

## V 0.4.0
- [ ] add total achievement count
- [ ] add achieved achievement count
- [ ] add completion %

- [ ] add game dlcs
- [ ] add game useful links
- [ ] add notes
- [ ] add game events

## V 0.5.0
- add general events (like e3, ...) 
  - with date, 
  - description,
- delete and list them
- edit them?
- filter/sort them?

## V 0.6.0
- mobile friendly website
- error pages

## V 0.7.0
- rework home:
    - bottom right: calendar with next events, game releases, dlc releases, game events (calendar shows their pic?)
    - bottom left: infinite scrolling list of upcoming games (even the ones with "unsure" dates, like "1st quarter 2023")
    - top: last visited games

## Idk when
- possibility to use dates like "2023", "1st quarter 2023", "summer 2021", "september 2024"
- global stores for the various types of alerts, with ability to show more than one alert at a time with no overlap
- fix typescript types, todos and bugs
- fix autofocus message in /login
- extract form stuff into separate components?