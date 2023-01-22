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
  - [ ] same component as add game
  
## V 0.3.0
- theme switch
- filter list
- sort list
- infinite scrolling in list
- working search box
- less ugly home page

## V 0.4.0
- add game dlcs
- add game useful links
- add notes
- add events

## V 0.5.0
- possibility to use dates like "2023", "1st quarter 2023", "summer 2021", "september 2024"
- add total achievement count
- add achieved achievement count
- add completion %

## V 0.6.0
- add general events (like e3, ...) with date, description, ...
- mobile friendly website
- error pages
- fix typescript types, todos and bugs
- fix autofocus message in /login
## V 0.7.0
- rework home:
    - bottom right: calendar with next events, game releases, dlc releases, game events (calendar shows their pic?)
    - bottom left: infinite scrolling list of upcoming games (even the ones with "unsure" dates, like "1st quarter 2023")
    - top: last visited games
